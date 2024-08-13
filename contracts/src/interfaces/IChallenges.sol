// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

interface IChallenges {
    // Structs and Enums
    /// @dev Status of the challenge
    enum ChallengeStatus {
        NotExist,
        Created,
        Settled
    }

    /// @dev Status of the user in the challenge
    enum UserStatus {
        NotExist,
        Joined,
        Claimable,
        Claimed
    }

    /// @dev Challenge struct
    /// @param verifier Verifier address to sign the check in data
    /// @param minimumCheckIns Minimum check-ins required to succeed
    /// @param startTimestamp Start timestamp of the challenge
    /// @param joinDueTimestamp Latest timestamp to join the challenge
    /// @param endTimestamp End timestamp of the challenge
    /// @param donateDestination Address to donate half of the failed user stake
    /// @param donationBPS Basis points of the donation amount
    /// @param checkInJudge Address of the contract to judge the check in data
    /// @param stakePerUser Stake amount required to join the challenge
    /// @param stakingAsset Staking asset accepted to pay for the stake when joining
    struct Challenge {
        address verifier;
        uint64 minimumCheckIns;
        uint64 startTimestamp;
        uint64 joinDueTimestamp;
        uint64 endTimestamp;
        address donateDestination;
        address checkInJudge;
        address asset;
        uint128 donationBPS;
        uint128 stakePerUser;
    }

    // Events
    /// @notice Emitted when a new challenge is created
    /// @param challengeId Id of the challenge
    /// @param challenge Challenge struct
    event Create(uint256 indexed challengeId, Challenge challenge);

    /// @notice Emitted when a user joins a challenge
    /// @param user Address of the user
    /// @param challengeId Id of the challenge
    event Join(address indexed user, uint256 indexed challengeId);

    /// @notice Emitted when a user checks in
    /// @param user Address of the user
    /// @param challengeId Id of the challenge
    /// @param checkInData Data signed by the verifier
    event CheckIn(address indexed user, uint256 indexed challengeId, bytes checkInData);

    /// @notice Emitted when a challenge is settled
    /// @param challengeId Id of the challenge
    event Settle(uint256 indexed challengeId);

    /// @notice Emitted when a user claims the reward
    /// @param user Address of the user
    /// @param challengeId Id of the challenge
    /// @param amount Amount claimed by the user
    event Claim(address indexed user, uint256 indexed challengeId, uint256 amount);

    /// @notice Emitted when the governance is transferred
    /// @param newGovernance Address of the new governance
    event GovernanceTransferred(address indexed newGovernance);

    /// @notice Emitted when the donation organization is set
    /// @param donationOrg Address of the donation organization
    /// @param status Enabled status of the donation organization
    event DonationOrgSet(address donationOrg, bool status);

    /// @notice Emitted when a protocol parameter is set
    /// @param key Key of the protocol parameter
    /// @param value Value of the protocol parameter
    event ProtocolParameterSet(string indexed key, uint256 value);

    // Errors
    /// @dev Error when the amount is zero
    error ZeroAmount();

    /// @dev Error when the address is zero
    error ZeroAddress();

    /// @dev Error when the permission level is invalid
    error InvalidPermission();

    /// @dev Error when the basis points is invalid
    error InvalidBPS();

    /// @dev Error when the timestamp is invalid
    error InvalidTimestamp();

    /// @dev Error when the challenge does not exist
    error ChallengeNotExist();

    /// @dev Error when the user has already joined the challenge
    error ChallengeJoined();

    /// @dev Error when the user has not joined the challenge
    error ChallengeNotJoined();

    /// @dev Error when the challenge is not settled
    error ChallengeSettled();

    /// @dev Error when the challenge is not settled
    error ChallengeNotSettled();

    /// @dev Error when the digest is used
    error DigestUsed();

    /// @dev Error when the signature is invalid
    error InvalidSignature();

    /// @dev Error when the check in judge returns an error
    error CheckInJudgeError();

    /// @dev Error when the user is not claimable
    error UserNotClaimable();

    // Functions
    /// @notice Create a new challenge
    /// @param challenge Challenge struct to create
    function create(Challenge calldata challenge) external;

    /// @notice Join a challenge
    /// @param challengeId Id of the challenge to join
    function join(uint256 challengeId) external;

    /// @notice Check in to a challenge
    /// @param challengeId Id of the challenge to check in
    /// @param checkInData Application specific extra check in data
    /// @param signature CheckInDigest signed by verifier address
    function checkIn(uint256 challengeId, bytes calldata checkInData, bytes calldata signature) external;

    /// @notice Withdraw the winning stake
    /// @param challengeId Id of the challenge to withdraw
    function withdraw(uint256 challengeId) external;

    /// @notice Get the challenge details
    /// @param challengeId Id of the challenge to get the details
    /// @return challenge Challenge struct of the challenge
    function getChallenge(uint256 challengeId) external view returns (Challenge memory);

    /// @notice Get the winning stake per user
    /// @param challengeId Id of the challenge to get the winning stake
    /// @return amount Amount of winning stake per user
    function getWinningStakePerUser(uint256 challengeId) external view returns (uint128);

    /// @notice Get the amount of users that have joined a challenge
    /// @param challengeId Id of the challenge
    /// @return totalUsers Amount of users that have joined the challenge
    function getChallengeParticipantsCount(uint256 challengeId) external view returns (uint256);

    /// @notice Get the amount of users that have succeeded in a challenge
    /// @param challengeId Id of the challenge
    /// @return totalSucceedUsers Amount of users that have succeeded in the challenge
    function getChallengeSucceedParticipantsCount(uint256 challengeId) external view returns (uint256);
}
