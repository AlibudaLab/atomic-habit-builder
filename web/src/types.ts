import { Address } from 'viem';
import { ChallengeTypes } from './constants';

export enum RunVerifier {
  None = 'None',
  Strava = 'Strava',
}

export enum WorkoutVerifier {
  None = 'None',
  Strava = 'Strava',
}

export type User = {
  id: string;
  totalCheckIns: string;
};

// Raw data from the chain / subgraph
export type ChallengeDetail = {
  id: number;
  startTimestamp: number;
  joinDueTimestamp: number;
  endTimestamp: number;
  verifier: string;
  stake: bigint;
  minimumCheckIns: number;
  donationDestination: Address;
  participants: number;
  totalStaked: bigint;
  succeedClaimable: bigint;
  challengeStatus: ChallengeStatus;
  joinedUsers: User[];
};

// Defined by us, off-chain
export type ChallengeMetaData = {
  id: number;
  name: string;
  type: ChallengeTypes;
  description?: string;
  public: boolean;
  accessCode?: string; // only for private challenges
  creator?: Address;
};

export type Challenge = ChallengeDetail & ChallengeMetaData;

export type ChallengeWithCheckIns = Challenge & {
  checkedIn: number;
  totalSucceeded: bigint;
  status: UserChallengeStatus;
};

export type DonationDest = {
  name: string;
  address: Address;
  logo?: string;
};

export type ActivityMap = Record<string, string[]>;

// user status defined on-chain
export enum UserStatus {
  NotExist,
  Joined,
  Claimable, // settled and can be claimed
  Claimed,
}

// challenge status defined on-chain
export enum ChallengeStatus {
  NotExist,
  Created,
  Settled,
}

// combining user status & challenge status, indicating what the user should do next
export enum UserChallengeStatus {
  // not started yet
  NotJoined = 'Not Joined',
  NotStarted = 'Not Started',
  // challenge in progress
  Ongoing = 'Ongoing',
  Completed = 'Completed', // completed all check-ins, challenge is still ongoing
  // challenge is past end time
  Claimable = 'Claimable', // completed check-ins, and challenge is past end time
  Failed = 'Failed', // challenge is past end time, and user has not completed all check-ins
  Claimed = 'Claimed',
}
