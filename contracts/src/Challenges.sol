// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "./interfaces/IChallenges.sol";
import "./interfaces/ICheckInJudge.sol";

contract Challenges is IChallenges, EIP712, Ownable {
    using SafeERC20 for IERC20;

    /// @dev Maximum basis points
    uint128 constant MAX_BPS = 10_000;

    /// @dev Minimum donation basis points
    uint128 public minDonationBPS;

    /// @dev Counter for the challenge id, starts from 1
    uint256 public challengeCounter;

    /// @dev Mapping of challenge id to challenge struct
    mapping(uint256 challengeId => Challenge) internal challenges;

    /// @dev Mapping of challenge id to total users joined the challenge
    mapping(uint256 challengeId => uint128) public totalUsers;

    /// @dev Mapping of challenge id to total users succeeded in the challenge
    mapping(uint256 challengeId => uint128) public totalSucceedUsers;

    /// @dev Mapping of challenge id to the challenge status
    mapping(uint256 challengeId => ChallengeStatus) public challengeStatus;

    /// @dev Mapping of challenge id to the user status in the challenge
    mapping(uint256 challengeId => mapping(address user => UserStatus)) public userStatus;

    /// @dev Mapping of check in digest to whether it has been used
    mapping(bytes32 digest => bool) public digestUsed;

    /// @dev Mapping of challenge id to user check ins data
    mapping(uint256 challengeId => mapping(address user => bytes[])) public checkIns;

    /// @dev Mapping of donation org to whether it is enabled
    mapping(address donationOrg => bool) public donationOrgsEnabled;

    modifier challengeExist(uint256 challengeId) {
        if (challengeStatus[challengeId] == ChallengeStatus.NotExist) revert ChallengeNotExist();
        _;
    }

    constructor(string memory name, string memory version, address initGovernance, uint128 initMinDonationBPS)
        EIP712(name, version)
        Ownable(initGovernance)
    {
        if (initMinDonationBPS > MAX_BPS) revert InvalidBPS();
        minDonationBPS = initMinDonationBPS;
    }

    /**
     * @notice Create a new challenge
     * @dev Refer to IChallenges.sol for the Challenge struct
     * @param challenge Challenge struct to create
     */
    function create(Challenge memory challenge) external {
        if (challenge.endTimestamp <= block.timestamp) revert InvalidTimestamp();
        if (challenge.joinDueTimestamp >= challenge.endTimestamp) revert InvalidTimestamp();
        if (challenge.startTimestamp >= challenge.joinDueTimestamp) revert InvalidTimestamp();
        if (challenge.donateDestination == address(0) || challenge.verifier == address(0)) revert ZeroAddress();
        if (!donationOrgsEnabled[challenge.donateDestination]) revert InvalidPermission();
        if (challenge.donationBPS > MAX_BPS || challenge.donationBPS < minDonationBPS) revert InvalidBPS();

        uint256 challengeId = ++challengeCounter;
        challenges[challengeId] = challenge;
        challengeStatus[challengeId] = ChallengeStatus.Created;

        emit Create(challengeCounter, challenge);
    }

    /**
     * @notice Join a challenge
     * @dev Users need to approve the tracker contract to transfer the stake amount before calling this function
     * @param challengeId Id of the challenge to join
     */
    function join(uint256 challengeId) external challengeExist(challengeId) {
        if (userStatus[challengeId][msg.sender] != UserStatus.NotExist) revert ChallengeJoined();
        if (block.timestamp > challenges[challengeId].joinDueTimestamp) revert InvalidTimestamp();

        IERC20(challenges[challengeId].asset).safeTransferFrom(
            msg.sender, address(this), challenges[challengeId].stakePerUser
        );
        userStatus[challengeId][msg.sender] = UserStatus.Joined;
        totalUsers[challengeId]++;

        emit Join(msg.sender, challengeId);
    }

    /**
     * @notice Check in to a challenge
     * @dev If the checkInJudge contract is specified by the challenge, checkInJudge.judge(checkInData) will be called
     * checkInJudge.judge(checkInData) should custom checks in addition to tha main tracker checks
     * The main tracker is only responsible for checking:
     * 1. The signature  is from the verifier
     * 2. The challenge ID is the ID included in the signing digest
     * 3. The msg.sender is the user address included in the signing digest
     * @param challengeId Id of the challenge to check in
     * @param checkInData Application specific extra check in data
     * @param signature CheckInDigest signed by verifier address
     */
    function checkIn(uint256 challengeId, bytes memory checkInData, bytes memory signature)
        external
        challengeExist(challengeId)
    {
        uint256 timestamp = block.timestamp;
        if (timestamp < challenges[challengeId].startTimestamp) revert InvalidTimestamp();
        if (timestamp > challenges[challengeId].endTimestamp) revert InvalidTimestamp();
        if (userStatus[challengeId][msg.sender] != UserStatus.Joined) revert ChallengeNotJoined();

        bytes32 digest = getCheckInDigest(challengeId, checkInData);
        if (digestUsed[digest]) revert DigestUsed();
        if (!SignatureChecker.isValidSignatureNow(challenges[challengeId].verifier, digest, signature)) {
            revert InvalidSignature();
        }

        address checkInJudge = challenges[challengeId].checkInJudge;
        if (checkInJudge != address(0) && !ICheckInJudge(checkInJudge).judge(checkInData)) revert CheckInJudgeError();

        digestUsed[digest] = true;
        checkIns[challengeId][msg.sender].push(checkInData);

        if (checkIns[challengeId][msg.sender].length == challenges[challengeId].minimumCheckIns) {
            totalSucceedUsers[challengeId]++;
            userStatus[challengeId][msg.sender] = UserStatus.Claimable;
        }

        emit CheckIn(msg.sender, challengeId, checkInData);
    }

    /**
     * @notice Settle the challenge, transfer half of the failed user stake to the donateDestination address
     * If no user has finished the challenge, the donation amount will be 100% of the failed user stake
     * @param challengeId Id of the challenge to settle
     */
    function settle(uint256 challengeId) external challengeExist(challengeId) {
        if (block.timestamp < challenges[challengeId].endTimestamp) revert InvalidTimestamp();
        if (challengeStatus[challengeId] == ChallengeStatus.Settled) revert ChallengeSettled();

        uint128 succeedUserCount = totalSucceedUsers[challengeId];
        uint128 donationBPS = succeedUserCount == 0 ? MAX_BPS : challenges[challengeId].donationBPS;
        uint256 amountToTransfer =
            (totalUsers[challengeId] - succeedUserCount) * challenges[challengeId].stakePerUser * donationBPS / MAX_BPS;

        IERC20(challenges[challengeId].asset).safeTransfer(challenges[challengeId].donateDestination, amountToTransfer);
        challengeStatus[challengeId] = ChallengeStatus.Settled;

        emit Settle(challengeId);
    }

    /**
     * @notice Withdraw the winning stake
     * @param challengeId Id of the challenge to withdraw
     */
    function withdraw(uint256 challengeId) external challengeExist(challengeId) {
        if (challengeStatus[challengeId] != ChallengeStatus.Settled) revert ChallengeNotSettled();
        if (userStatus[challengeId][msg.sender] != UserStatus.Claimable) revert UserNotClaimable();

        uint128 amount = getWinningStakePerUser(challengeId);
        if (amount == 0) revert ZeroAmount();

        userStatus[challengeId][msg.sender] = UserStatus.Claimed;
        IERC20(challenges[challengeId].asset).safeTransfer(msg.sender, amount);

        emit Claim(msg.sender, challengeId, amount);
    }

    /**
     * @notice Get the check in digest
     * @param challengeId Id of the challenge to check in
     * @param checkInData Application specific extra check in data
     * @return digest Check-in digest to prevent replay attack
     */
    function getCheckInDigest(uint256 challengeId, bytes memory checkInData) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("checkInSigningMessage(uint256 challengeId,address user,bytes checkInData)"),
                    challengeId,
                    msg.sender,
                    keccak256(checkInData)
                )
            )
        );
    }

    /**
     * @notice Get the challenge details
     * @param challengeId Id of the challenge to get the details
     * @return challenge Challenge struct of the challenge
     */
    function getChallenge(uint256 challengeId) external view returns (Challenge memory) {
        return challenges[challengeId];
    }

    /**
     * @notice Get the winning stake per user
     * @param challengeId Id of the challenge to get the winning stake
     * @return amount Amount of winning stake per user
     */
    function getWinningStakePerUser(uint256 challengeId) public view returns (uint128) {
        uint128 totalUsersCount = totalUsers[challengeId];
        uint128 succeedUserCount = totalSucceedUsers[challengeId];
        uint128 stakePerUser = challenges[challengeId].stakePerUser;

        if (challengeStatus[challengeId] != ChallengeStatus.Settled || succeedUserCount == 0) return 0;

        uint128 totalStake = totalUsersCount * stakePerUser;
        uint128 donation =
            (totalUsersCount - succeedUserCount) * stakePerUser * challenges[challengeId].donationBPS / MAX_BPS;

        return (totalStake - donation) / succeedUserCount;
    }

    /**
     * @notice Get the amount of check-ins that the user has done for a challenge
     * @param challengeId Id of the challenge
     * @param user Address of the user
     * @return checkInCounts Amount of check-ins that the user has done
     */
    function getUserCheckInCounts(uint256 challengeId, address user) external view returns (uint256) {
        return checkIns[challengeId][user].length;
    }

    /**
     * @notice Get the amount of users that have joined a challenge
     * @param challengeId Id of the challenge
     * @return totalUsers Amount of users that have joined the challenge
     */
    function getChallengeParticipantsCount(uint256 challengeId) external view returns (uint256) {
        return totalUsers[challengeId];
    }

    /**
     * @notice Get the amount of users that have succeeded in a challenge
     * @param challengeId Id of the challenge
     * @return totalSucceedUsers Amount of users that have succeeded in the challenge
     */
    function getChallengeSucceedParticipantsCount(uint256 challengeId) external view returns (uint256) {
        return totalSucceedUsers[challengeId];
    }

    /**
     * @notice Enable or disable the donation org
     * @param donationOrg Address of the donation org
     * @param enabled Whether to enable or disable the donation org
     */
    function setDonationOrgEnabled(address donationOrg, bool enabled) external onlyOwner {
        if (donationOrg == address(0)) revert ZeroAddress();
        donationOrgsEnabled[donationOrg] = enabled;
        emit DonationOrgSet(donationOrg, enabled);
    }

    /**
     * @notice Set the minimum donation basis points
     * @param _minDonationBPS Minimum donation basis points
     */
    function setMinDonationBPS(uint128 _minDonationBPS) external onlyOwner {
        if (_minDonationBPS > MAX_BPS) revert InvalidBPS();
        minDonationBPS = _minDonationBPS;
        emit ProtocolParameterSet("minDonationBPS", _minDonationBPS);
    }
}
