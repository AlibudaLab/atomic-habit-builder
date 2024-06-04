import { baseSepolia } from 'viem/chains';
import { ChallengeMetaData } from './types';

export const EXPECTED_CHAIN = baseSepolia;

export enum ChallengeTypes {
  Run = 'Run',
  Workout = 'Workout',
  NFC_Chip = 'NFC Chip',
}

export const challengeMetaDatas: ChallengeMetaData[] = [
  // {
  //   id: BigInt(0),
  //   name: 'NFC Challenge 1',
  //   type: ChallengeTypes.NFC_Chip,
  //   description: 'Go to Sydney Park and find the hidden NFC chip to check in!',
  // },
  // {
  //   id: BigInt(1),
  //   name: 'NFC Challenge',
  //   type: ChallengeTypes.NFC_Chip,
  //   description: 'Go find a cool dev with the ARX chip to check in!',
  // },
  {
    id: BigInt(2),
    name: 'June Running Challenge',
    description: 'Finish more than 10 runs on Strava in June to complete this challenge!',
    type: ChallengeTypes.Run,
  },
  {
    id: BigInt(3),
    name: 'Alibuda Workout Challenge #1',
    description: 'Finish more than 14 workouts on Strava to complete this challenge!',
    type: ChallengeTypes.Workout,
  },
  {
    id: BigInt(4),
    name: 'July Running Challenge',
    description: 'Finish more than 10 runs on Strava in July to complete this challenge!',
    type: ChallengeTypes.Run,
  },
  {
    id: BigInt(5),
    name: 'Alibuda Workout Challenge #2',
    description: 'Finish more than 14 workouts on Strava to complete this challenge!',
    type: ChallengeTypes.Workout,
  },
];
