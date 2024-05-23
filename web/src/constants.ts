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
  //   description: "Go to Sydney Park and find the hidden NFC chip to check in!",
  //   mapKey:
  //     'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4538.887349249702!2d151.18208387288763!3d-33.91119650996505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b04b8d42ec9f%3A0x2f847bc8689ddf4e!2sSydney%20Park!5e0!3m2!1sen!2sau!4v1714808662978!5m2!1sen!2sau',
  // },
  // {
  //   id: BigInt(1),
  //   name: 'NFC Challenge 2',
  //   type: ChallengeTypes.NFC_Chip,
  //   description: "Go find a cool dev with the ARX chip to check in!",
  //   mapKey:
  //     'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1544.6353424376618!2d151.1926899112038!3d-33.91546028732731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b1ae0360049d%3A0x2e2b1515500087a0!2sThe%20Venue%20Alexandria!5e0!3m2!1sen!2sau!4v1714808818093!5m2!1sen!2sau',
  // },
  {
    id: BigInt(2),
    name: 'May Running Challenge',
    description: 'Finish more than 10 runs on Strava in May to complete this challenge!',
    type: ChallengeTypes.Run,
  },
  {
    id: BigInt(3),
    name: 'June Running Challenge',
    description: 'Finish more than 10 runs on Strava in June to complete this challenge!',
    type: ChallengeTypes.Run,
  },
];
