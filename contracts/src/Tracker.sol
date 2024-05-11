// SPDX-License-Identifier: MIT
pragma solidity 0.8.25;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

//FIXME: There should be challenge id
struct Challenge {
    uint256 minimunCheckIns;
    uint256 startTimestamp;
    uint256 endTimestamp;
    address donateDestination;
    uint256 perUserStake;
    uint256 totalStake;
    bool settled;
}

contract Tracker {
    using ECDSA for bytes32;

    //FIXME: This should be included in struct Challenge
    ERC20 public underlyingToken;

    mapping(address arxAddress => Challenge) public challenges;
    mapping(address userAddress => address[]) public userChallenges;
    mapping(address userAddress => uint256) public balances;
    mapping(address arxAddress => mapping(address userAddress => uint256[])) public checkIns;
    mapping(address arxAddress => mapping(address userAddress => bool)) public hasJoined;
    mapping(address arxAddress => address[]) public participants;
    mapping(address arxAddress => address[]) public succeedParticipants;

    event CheckIn(address indexed userAddress, address indexed arxAddress, uint256 timestamp);
    event Register(
        address indexed arxAddress,
        string description,
        uint256 startTimestamp,
        uint256 endTimestamp,
        uint256 minimumCheckIns
    );
    event Join(address indexed userAddress, address indexed arxAddress);
    event Settle(address indexed arxAddress);

    constructor(address _underlyingToken) {
        //FIXME: This should be moved to register
        underlyingToken = ERC20(_underlyingToken);
    }

    //FIXME: This should be created with token specify
    // register a new habit challenge
    function register(
        address arxAddress,
        string memory description,
        uint256 minimunCheckIns,
        uint256 startTimestamp,
        uint256 endTimestamp,
        address donateDestination,
        uint256 stake
    ) public {
        require(challenges[arxAddress].startTimestamp == 0, "Challenge already exists");
        //require(endTimestamp > startTimestamp, "End timestamp must be greater than start timestamp");
        challenges[arxAddress] =
            Challenge(minimunCheckIns, startTimestamp, endTimestamp, donateDestination, stake, 0, false);
        emit Register(arxAddress, description, startTimestamp, endTimestamp, minimunCheckIns);
    }

    // user join a habit challenge
    function join(address arxAddress) public payable {
        require(challenges[arxAddress].startTimestamp != 0, "Challenge does not exist");
        //require(block.timestamp < challenges[arxAddress].startTimestamp, "Challenge has started");
        underlyingToken.transferFrom(msg.sender, address(this), challenges[arxAddress].perUserStake);
        hasJoined[arxAddress][msg.sender] = true;
        userChallenges[msg.sender].push(arxAddress);
        participants[arxAddress].push(msg.sender);
        challenges[arxAddress].totalStake += challenges[arxAddress].perUserStake;
        emit Join(msg.sender, arxAddress);
    }

    /* Todo: implement timestamp and sender address checks in the signature */
    function checkIn(address arxAddress, bytes32 msgHash, uint8 v, bytes32 r, bytes32 s) public {
        uint256 timestamp = block.timestamp;
        /*require(
            timestamp <= challenges[arxAddress].endTimestamp && timestamp >= challenges[arxAddress].startTimestamp,
            "Invalid timestamp"
        );*/
        require(hasJoined[arxAddress][msg.sender], "User has not joined the challenge");
        address recoveredAddr = ECDSA.recover(msgHash, v, r, s);
        require(recoveredAddr == arxAddress, "Invalid signature");
        checkIns[arxAddress][msg.sender].push(timestamp);
        if (checkIns[arxAddress][msg.sender].length == challenges[arxAddress].minimunCheckIns) {
            challenges[arxAddress].totalStake -= challenges[arxAddress].perUserStake;
            balances[msg.sender] += challenges[arxAddress].perUserStake;
            succeedParticipants[arxAddress].push(msg.sender);
        }
        emit CheckIn(msg.sender, arxAddress, timestamp);
    }

    // settle a challenge after the ending timestamp
    function settle(address arxAddress) public {
        //require(block.timestamp > challenges[arxAddress].endTimestamp, "Challenge has not ended");
        emit Settle(arxAddress);
        challenges[arxAddress].settled = true;

        if (succeedParticipants[arxAddress].length == 0 || challenges[arxAddress].totalStake == 0) return;

        uint256 halfStakeBalance = challenges[arxAddress].totalStake / 2;
        uint256 bonus = halfStakeBalance / succeedParticipants[arxAddress].length;

        for (uint256 i = 0; i < succeedParticipants[arxAddress].length; i++) {
            address participant = participants[arxAddress][i];
            balances[participant] += bonus;
        }

        bool sent = underlyingToken.transfer(challenges[arxAddress].donateDestination, halfStakeBalance);
        require(sent, "Failed to send Ether");
    }

    //FIXME: This should be withdraw by challenge id
    function withdraw() public {
        uint256 balance = balances[msg.sender];
        require(balance > 0, "Insufficient balance");
        balances[msg.sender] = 0;
        bool sent = underlyingToken.transfer(msg.sender, balance);
        require(sent, "Failed to send Ether");
    }

    function getUserChallenges(address userAddress) public view returns (address[] memory) {
        return userChallenges[userAddress];
    }

    function getUserCheckInCounts(address arxAddress, address userAddress) public view returns (uint256) {
        return checkIns[arxAddress][userAddress].length;
    }
}
