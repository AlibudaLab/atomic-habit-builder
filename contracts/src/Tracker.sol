// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

struct Challenge {
    address verifierAddress;
    uint256 minimunCheckIns;
    uint256 startTimestamp;
    uint256 endTimestamp;
    address donateDestination;
    uint256 perUserStake;
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
    mapping(address userAddress => uint256[]) public userChallenges;
    mapping(address userAddress => uint256) public balances;
    mapping(uint256 challengeId => mapping(address userAddress => uint256[])) public checkIns;
    mapping(uint256 challengeId => mapping(address userAddress => bool)) public hasJoined;
    mapping(uint256 challengeId => address[]) public participants;
    mapping(uint256 challengeId => address[]) public succeedParticipants;
    mapping(bytes32 digest => bool) public digestUsed;

    event CheckIn(address indexed userAddress, uint256 indexed challengeId, uint256 timestamp);
    event Register(
        uint256 indexed challengeId,
        address verifierAddress,
        string description,
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 minimumCheckIns
    );
    event Join(address indexed userAddress, uint256 indexed challengeId);
    event Settle(uint256 indexed challengeId);

    constructor(address _underlyingToken, string memory name, string memory version) EIP712(name, version) {
        //FIXME: This should be moved to register
        underlyingToken = _underlyingToken;
    }

    //FIXME: This should be created with token specify
    // register a new habit challenge
    function register(
        address verifierAddress,
        string memory description,
        uint256 minimunCheckIns,
        uint256 startTimestamp,
        uint256 endTimestamp,
        address donateDestination,
        uint256 stake
    ) public {
        //require(endTimestamp > startTimestamp, "End timestamp must be greater than start timestamp");
        challenges[challengeCounter] = Challenge(
            verifierAddress, minimunCheckIns, startTimestamp, endTimestamp, donateDestination, stake, 0, false
        );
        emit Register(challengeCounter, verifierAddress, description, startTimestamp, endTimestamp, minimunCheckIns);

        challengeCounter++;
    }

    // user join a habit challenge
    function join(uint256 challengeId) public payable {
        require(challenges[challengeId].startTimestamp != 0, "Challenge does not exist");
        //require(block.timestamp < challenges[challengeId].startTimestamp, "Challenge has started");
        IERC20(underlyingToken).safeTransferFrom(msg.sender, address(this), challenges[challengeId].perUserStake);
        hasJoined[challengeId][msg.sender] = true;
        userChallenges[msg.sender].push(challengeId);
        participants[challengeId].push(msg.sender);
        challenges[challengeId].totalStake += challenges[challengeId].perUserStake;
        emit Join(msg.sender, challengeId);
    }

    function checkIn(uint256 challengeId, uint256 timestamp, uint8 v, bytes32 r, bytes32 s) public {
        /*require(
            timestamp <= challenges[challengeId].endTimestamp && timestamp >= challenges[challengeId].startTimestamp,
            "Invalid timestamp"
        );*/
        require(hasJoined[challengeId][msg.sender], "User has not joined the challenge");
        bytes32 digest = getCheckInDigest(challengeId, timestamp, msg.sender);
        require(!digestUsed[digest], "digest has been used");
        require(challenges[challengeId].verifierAddress == ECDSA.recover(digest, v, r, s), "invalid signature");

        digestUsed[digest] = true;
        checkIns[challengeId][msg.sender].push(timestamp);
        if (checkIns[challengeId][msg.sender].length == challenges[challengeId].minimunCheckIns) {
            challenges[challengeId].totalStake -= challenges[challengeId].perUserStake;
            balances[msg.sender] += challenges[challengeId].perUserStake;
            succeedParticipants[challengeId].push(msg.sender);
        }
        emit CheckIn(msg.sender, challengeId, timestamp);
    }

    // settle a challenge after the ending timestamp
    function settle(uint256 challengeId) public {
        //require(block.timestamp > challenges[challengeId].endTimestamp, "Challenge has not ended");
        emit Settle(challengeId);
        challenges[challengeId].settled = true;

        if (succeedParticipants[challengeId].length == 0 || challenges[challengeId].totalStake == 0) return;

        uint256 halfStakeBalance = challenges[challengeId].totalStake / 2;
        uint256 bonus = halfStakeBalance / succeedParticipants[challengeId].length;

        for (uint256 i = 0; i < succeedParticipants[challengeId].length; i++) {
            address participant = participants[challengeId][i];
            balances[participant] += bonus;
        }

        IERC20(underlyingToken).safeTransfer(challenges[challengeId].donateDestination, halfStakeBalance);
    }

    //FIXME: This should be withdraw by challenge id
    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");
        balances[msg.sender] = 0;
        IERC20(underlyingToken).safeTransfer(msg.sender, balance);
    }

    function getCheckInDigest(uint256 challengeId, uint256 timestamp, address participant)
        public
        view
        returns (bytes32)
    {
        return _hashTypedDataV4(
            keccak256(
                abi.encode(
                    keccak256("checkInSigningMessage(uint256 challengeId, uint256 timestamp, address participant)"),
                    challengeId,
                    timestamp,
                    participant
                )
            )
        );
    }

    function getUserChallenges(address userAddress) public view returns (uint256[] memory) {
        return userChallenges[userAddress];
    }

    function getUserCheckInCounts(uint256 challengeId, address userAddress) public view returns (uint256) {
        return checkIns[challengeId][userAddress].length;
    }
}
