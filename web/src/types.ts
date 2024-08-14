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

// Raw data from the chain / subgraph
export type ChallengeDetail = {
  id: number;
  startTimestamp: number;
  joinDueTimestamp: number;
  endTimestamp: number;
  verifier: string;
  stake: bigint;
  targetNum: number;
  donationDestination: Address;
  participants: number;
  totalStaked: bigint;
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
  succeedClaimable: bigint;
  totalSucceeded: bigint;
};

export type DonationDest = {
  name: string;
  address: Address;
  logo?: string;
};

export type ActivityMap = Record<string, string[]>;

export enum UserStatus {
  NotExist,
  Joined,
  Claimable,
  Claimed,
}
