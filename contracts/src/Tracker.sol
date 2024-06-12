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

    //FIXME: This should be created with token specify
    // register a new habit challenge
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
    ) public {
        require(endTimestamp > startTimestamp, "end timestamp must be greater than start timestamp");
        require(joinDueTimestamp <= endTimestamp, "should not allow joining time larger than challenge ending time");
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

    // user join a habit challenge
    function join(uint256 challengeId) public payable {
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
     * @param challengeId id of the challenge to check in, required to prevent replays from other challenges in case the same verifiers are used.
     * @param checkInData application specific extra check in data.
     * @param signature checkInDigest signed by verifier address.
     * @dev If the checkInJudge contract is specified, checkInData would be passed with the call checkInJudge.judge(checkInData).
     * checkInJudge.judge(checkInData) should implement what to check on and replay prevention and the checkInJudge contract address should be specified at challenge creation.
     * The main tracker is only responsible for checking:
     * 1. If the signing address matches the validator address
     * 2. The challenge ID is the ID included in the signing digest.
     * 3. The msg.sender is the user address included in the signing digest.
     */
    function checkIn(uint256 challengeId, bytes memory checkInData, bytes memory signature) public {
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

    // settle a challenge after the ending timestamp
    function settle(uint256 challengeId) public {
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

    function withdraw(uint256 challengeId) public {
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

    function getUserChallenges(address user) public view returns (uint256[] memory) {
        return userChallenges[user];
    }

    function getUserCheckInCounts(uint256 challengeId, address user) public view returns (uint256) {
        return checkIns[challengeId][user].length;
    }
}
