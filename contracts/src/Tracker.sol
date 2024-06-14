// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "./interfaces/ICheckInJudge.sol";

struct Challenge {
    address verifier;
    uint64 minimumCheckIns;
    uint64 startTimestamp;
    uint64 joinDueTimestamp;
    uint64 endTimestamp;
    address donateDestination;
    address checkInJudge;
    uint256 stakePerUser;
    uint256 totalStake;
    bool settled;
}

contract Tracker is EIP712 {
    using SafeERC20 for IERC20;

    //FIXME: This should be included in struct Challenge
    address public underlyingToken;
    uint256 public challengeCounter;

    mapping(uint256 challengeId => Challenge) public challenges;
    mapping(uint256 challengeId => address[]) public users;
    mapping(uint256 challengeId => address[]) public succeedUsers;
    mapping(bytes32 digest => bool) public digestUsed;
    mapping(address user => uint256[]) public userChallenges;

    mapping(uint256 challengeId => mapping(address user => uint256[])) public checkIns;
    mapping(uint256 challengeId => mapping(address user => bool)) public hasJoined;
    mapping(uint256 challengeId => mapping(address user => bool)) public claimable;

    event CheckIn(address indexed user, uint256 indexed challengeId, uint256 timestamp);
    event Register(
        uint256 indexed challengeId,
        address verifier,
        string extraData,
        uint256 startTimestamp,
        uint256 joinDueTimestamp,
        uint256 endTimestamp,
        uint256 minimumCheckIns,
        address donationDestination,
        address checkInJudge
    );
    event Join(address indexed user, uint256 indexed challengeId);
    event Settle(uint256 indexed challengeId);

    constructor(address _underlyingToken, string memory name, string memory version) EIP712(name, version) {
        //FIXME: This should be moved to register
        underlyingToken = _underlyingToken;
    }

    /**
     * @notice Register a new challenge
     * @param verifier verifier address to sign the check in data
     * @param extraData additional data to emit
     * @param minimumCheckIns minimum check ins required to succeed
     * @param startTimestamp start timestamp of the challenge
     * @param joinDueTimestamp latest timestamp to join the challenge
     * @param endTimestamp end timestamp of the challenge
     * @param donateDestination address to donate half of the failed user stake
     * @param checkInJudge address of the contract to judge the check in data
     * @param stake stake amount required to join the challenge
     */
    function register(
        address verifier,
        string memory extraData,
        uint64 minimumCheckIns,
        uint64 startTimestamp,
        uint64 joinDueTimestamp,
        uint64 endTimestamp,
        address donateDestination,
        address checkInJudge,
        uint256 stake
    ) external {
        require(endTimestamp > startTimestamp, "end timestamp must be greater than start timestamp");
        require(joinDueTimestamp <= endTimestamp, "should not allow joining time larger than challenge ending time");
        require(donateDestination != address(0), "invalid donate destination");
        challenges[++challengeCounter] = Challenge(
            verifier,
            minimumCheckIns,
            startTimestamp,
            joinDueTimestamp,
            endTimestamp,
            donateDestination,
            checkInJudge,
            stake,
            0,
            false
        );
        emit Register(
            challengeCounter,
            verifier,
            extraData,
            startTimestamp,
            joinDueTimestamp,
            endTimestamp,
            minimumCheckIns,
            donateDestination,
            checkInJudge
        );
    }

    /**
     * @dev Users need to approve the tracker contract to transfer the stake amount before calling this function.
     * @param challengeId id of the challenge to join
     */
    function join(uint256 challengeId) external payable {
        require(challenges[challengeId].startTimestamp != 0, "challenge does not exist");
        require(!hasJoined[challengeId][msg.sender], "user already joined the challenge");
        require(block.timestamp < challenges[challengeId].joinDueTimestamp, "joining period has ended");

        IERC20(underlyingToken).safeTransferFrom(msg.sender, address(this), challenges[challengeId].stakePerUser);
        hasJoined[challengeId][msg.sender] = true;
        userChallenges[msg.sender].push(challengeId);
        users[challengeId].push(msg.sender);
        challenges[challengeId].totalStake += challenges[challengeId].stakePerUser;
        emit Join(msg.sender, challengeId);
    }

    /**
     * @dev If the checkInJudge contract is specified by the challenge, checkInJudge.judge(checkInData) will be called.
     * checkInJudge.judge(checkInData) should custom checks in addition to tha main tracker checks.
     * The main tracker is only responsible for checking:
     * 1. The signature  is from the verifier
     * 2. The challenge ID is the ID included in the signing digest.
     * 3. The msg.sender is the user address included in the signing digest.
     * @param challengeId id of the challenge to check in, required to prevent replays from other challenges in case the same verifiers are used.
     * @param checkInData application specific extra check in data.
     * @param signature checkInDigest signed by verifier address.
     */
    function checkIn(uint256 challengeId, bytes memory checkInData, bytes memory signature) external {
        uint256 timestamp = block.timestamp;
        require(
            timestamp >= challenges[challengeId].startTimestamp && timestamp <= challenges[challengeId].endTimestamp,
            "invalid checkin period"
        );
        require(hasJoined[challengeId][msg.sender], "user has not joined the challenge");

        bytes32 digest = getCheckInDigest(challengeId, msg.sender, checkInData);
        require(!digestUsed[digest], "digest has been used");
        require(
            SignatureChecker.isValidSignatureNow(challenges[challengeId].verifier, digest, signature),
            "invalid signature"
        );

        address checkInJudge = challenges[challengeId].checkInJudge;

        if (checkInJudge != address(0)) {
            require(ICheckInJudge(checkInJudge).judge(checkInData), "checkin criteria not met");
        }

        digestUsed[digest] = true;
        checkIns[challengeId][msg.sender].push(timestamp);

        if (checkIns[challengeId][msg.sender].length == challenges[challengeId].minimumCheckIns) {
            succeedUsers[challengeId].push(msg.sender);
            claimable[challengeId][msg.sender] = true;
        }
        emit CheckIn(msg.sender, challengeId, timestamp);
    }

    /**
     * @notice Settle the challenge, transfer half of the failed user stake to the donateDestination address
     * @param challengeId id of the challenge to settle
     */
    function settle(uint256 challengeId) external {
        require(challenges[challengeId].startTimestamp != 0, "challenge does not exist");
        require(block.timestamp > challenges[challengeId].endTimestamp, "challenge has not ended");
        require(!challenges[challengeId].settled, "challenge already settled");
        emit Settle(challengeId);
        challenges[challengeId].settled = true;
        uint256 succeedUserCounts = succeedUsers[challengeId].length;
        uint256 halfFailedUserStake =
            (challenges[challengeId].totalStake - (succeedUserCounts * challenges[challengeId].stakePerUser)) / 2;
        challenges[challengeId].totalStake -= halfFailedUserStake;
        IERC20(underlyingToken).safeTransfer(challenges[challengeId].donateDestination, halfFailedUserStake);
    }

    function getClaimableAmount(uint256 challengeId, address user) public view returns (uint256) {
        uint256 succeedUserCount = succeedUsers[challengeId].length;

        if (!challenges[challengeId].settled || !claimable[challengeId][user] || succeedUserCount == 0) {
            return 0;
        }

        return challenges[challengeId].totalStake / succeedUserCount;
    }

    function withdraw(uint256 challengeId) external {
        require(challenges[challengeId].settled, "challenge not yet settled");
        uint256 amount = getClaimableAmount(challengeId, msg.sender);
        claimable[challengeId][msg.sender] = false;
        IERC20(underlyingToken).safeTransfer(msg.sender, amount);
    }

    function getCheckInDigest(uint256 challengeId, address user, bytes memory checkInData)
        public
        view
        returns (bytes32)
    {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("checkInSigningMessage(uint256 challengeId,address user,bytes checkInData)"),
                    challengeId,
                    user,
                    checkInData
                )
            )
        );
    }

    /**
     * @notice Get the list of challenges that the user has joined
     */
    function getUserChallenges(address user) external view returns (uint256[] memory) {
        return userChallenges[user];
    }

    /**
     * @notice Get the amount of check-ins that the user has done for a challenge
     */
    function getUserCheckInCounts(uint256 challengeId, address user) external view returns (uint256) {
        return checkIns[challengeId][user].length;
    }

    /**
     * @notice Get the amount of users that have joined a challenge
     */
    function getChallengeParticipantsCount(uint256 challengeId) external view returns (uint256) {
        return users[challengeId].length;
    }

    /**
     * @notice Get the amount of users that have succeeded in a challenge
     */
    function getChallengeSucceedParticipantsCount(uint256 challengeId) external view returns (uint256) {
        return succeedUsers[challengeId].length;
    }
}
