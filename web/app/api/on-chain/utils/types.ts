export type Challenge = {
  id: string;
  verifier: string;
  minimumCheckIns: string;
  startTimestamp: string;
  joinDueTimestamp: string;
  endTimestamp: string;
  donateDestination: string;
  totalUsers: string;
  stakePerUser: string;
  totalStake: string;
  status: string;
  checkInJudge?: string;
  asset?: string;
  donationBPS?: string;
  totalCheckIns?: string;
  totalClaims?: string;
  totalSucceedUsers?: string;
  totalFailedUsers?: string;
  joinedUsers: [User];
};

export type User = {
  user: {
    id: string;
  };
};

export type LatestChallenge = {
  id: string;
};

export type ChallengesQueryResult = {
  challenges: Challenge[];
  latestChallenge: LatestChallenge[];
};

export type ChallengeQueryResult = {
  challenge: Challenge | null;
};

export type UserChallengeHistory = {
  challengeId: Challenge;
  checkIns: [];
  status: string;
};

export type UserQueryResult = {
  user: {
    challengeHistory: UserChallengeHistory[];
    totalJoinedChallenges: string;
  } | null;
};

export type ChallengeWithUserStatus = Challenge & {
  userStatus: string;
};

export type CheckInCountQueryResult = {
  userChallenge: {
    checkIns: {
      id: string;
    }[];
  } | null;
};
