// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

struct Challenge {
    address verifier;
    uint256 minimunCheckIns;
    uint256 startTimestamp;
    uint256 endTimestamp;
    address donateDestination;
    uint256 stakePerUser;
    uint256 totalStake;
    bool settled;
}

contract Tracker is EIP712 {
    using SafeERC20 for IERC20;
    using ECDSA for bytes32;

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
        string description,
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 minimumCheckIns
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
        string memory description,
        uint256 minimunCheckIns,
        uint256 startTimestamp,
        uint256 endTimestamp,
        address donateDestination,
        uint256 stake
    ) public {
        //require(endTimestamp > startTimestamp, "End timestamp must be greater than start timestamp");
        challenges[challengeCounter++] =
            Challenge(verifier, minimunCheckIns, startTimestamp, endTimestamp, donateDestination, stake, 0, false);
        emit Register(challengeCounter, verifier, description, startTimestamp, endTimestamp, minimunCheckIns);
    }

    // user join a habit challenge
    function join(uint256 challengeId) public payable {
        require(challenges[challengeId].startTimestamp != 0, "challenge does not exist");
        require(!hasJoined[challengeId][msg.sender], "user already joined the challenge");
        //require(block.timestamp < challenges[challengeId].startTimestamp, "Challenge has started");

        IERC20(underlyingToken).safeTransferFrom(msg.sender, address(this), challenges[challengeId].stakePerUser);
        hasJoined[challengeId][msg.sender] = true;
        userChallenges[msg.sender].push(challengeId);
        users[challengeId].push(msg.sender);
        challenges[challengeId].totalStake += challenges[challengeId].stakePerUser;
        emit Join(msg.sender, challengeId);
    }

    function checkIn(uint256 challengeId, uint256 timestamp, uint8 v, bytes32 r, bytes32 s) public {
        /*require(
            timestamp <= challenges[challengeId].endTimestamp && timestamp >= challenges[challengeId].startTimestamp,
            "Invalid timestamp"
        );*/
        require(hasJoined[challengeId][msg.sender], "user has not joined the challenge");
        bytes32 digest = getCheckInDigest(challengeId, timestamp, msg.sender);
        require(!digestUsed[digest], "digest has been used");
        require(challenges[challengeId].verifier == ECDSA.recover(digest, v, r, s), "invalid signature");

        digestUsed[digest] = true;
        checkIns[challengeId][msg.sender].push(timestamp);

        if (checkIns[challengeId][msg.sender].length == challenges[challengeId].minimunCheckIns) {
            succeedUsers[challengeId].push(msg.sender);
            claimable[challengeId][msg.sender] = true;
        }
        emit CheckIn(msg.sender, challengeId, timestamp);
    }

    // settle a challenge after the ending timestamp
    function settle(uint256 challengeId) public {
        //require(block.timestamp > challenges[challengeId].endTimestamp, "Challenge has not ended");
        emit Settle(challengeId);
        challenges[challengeId].settled = true;
        uint256 succeedUserCounts = succeedUsers[challengeId].length;

        if (succeedUserCounts > 0) {
            uint256 halfFailedUserStake =
                (challenges[challengeId].totalStake - (succeedUserCounts * challenges[challengeId].stakePerUser)) / 2;
            challenges[challengeId].totalStake -= halfFailedUserStake;
            IERC20(underlyingToken).safeTransfer(challenges[challengeId].donateDestination, halfFailedUserStake);
        } else {
            uint256 balance = challenges[challengeId].totalStake;
            challenges[challengeId].totalStake = 0;
            IERC20(underlyingToken).safeTransfer(challenges[challengeId].donateDestination, balance);
        }
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
        require(claimable[challengeId][msg.sender], "user not eligible or already claimed");
        uint256 amount = getClaimableAmount(challengeId, msg.sender);
        IERC20(underlyingToken).safeTransfer(msg.sender, amount);
    }

    function getCheckInDigest(uint256 challengeId, uint256 timestamp, address user) public view returns (bytes32) {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("checkInSigningMessage(uint256 challengeId, uint256 timestamp, address user)"),
                    challengeId,
                    timestamp,
                    user
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
