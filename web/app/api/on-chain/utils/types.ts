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

export type SimplifiedChallenge = {
  id: string;
  status: string;
};

export type UserChallengeHistory = {
  challengeId: SimplifiedChallenge;
  status: string;
};

export type UserQueryResult = {
  user: {
    challengeHistory: UserChallengeHistory[];
    totalJoinedChallenges: string;
  } | null;
};

export type ChallengeWithUserStatus = SimplifiedChallenge & {
  userStatus: string;
};

export type CheckInCountQueryResult = {
  userChallenge: {
    checkIns: {
      id: string;
    }[];
  } | null;
};
