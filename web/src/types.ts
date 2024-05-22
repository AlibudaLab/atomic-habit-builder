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
  id: bigint;
  startTimestamp: number;
  endTimestamp: number;
  verifier: string;
  stake: bigint;
  targetNum: number;
};

// Defined by us, off-chain
export type ChallengeMetaData = {
  id: bigint;
  name: string;
  type: ChallengeTypes;
  mapKey?: string;
};

export type Challenge = ChallengeDetail & ChallengeMetaData;
