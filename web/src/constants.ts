import { baseSepolia } from 'viem/chains';
import { Challenge } from './hooks/useUserChallenges';

export const EXPECTED_CHAIN = baseSepolia;

export enum ChallengeTypes {
  Run = 'Run',
  Workout = 'Workout',
  NFC_Chip = 'NFC Chip',
}

export const challenges: Challenge[] = [
  {
    name: 'NFC Challenge 1',
    id: BigInt(0),
    duration: 'May 1 - 27',
    verifier: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299',
    stake: 0.2,
    donationOrg: 'Gitcoin',
    type: ChallengeTypes.NFC_Chip,
    mapKey:
      'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4538.887349249702!2d151.18208387288763!3d-33.91119650996505!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b04b8d42ec9f%3A0x2f847bc8689ddf4e!2sSydney%20Park!5e0!3m2!1sen!2sau!4v1714808662978!5m2!1sen!2sau',
    targetNum: 10,
  },
  {
    name: 'NFC Challenge 2',
    id: BigInt(1),
    duration: 'May 3 - 6',
    verifier: '0xcAb2459DE5C9109B82c3fAc92B5c80209FA53C07',
    stake: 0.5,
    donationOrg: 'Gitcoin',
    type: ChallengeTypes.NFC_Chip,
    mapKey:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1544.6353424376618!2d151.1926899112038!3d-33.91546028732731!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b1ae0360049d%3A0x2e2b1515500087a0!2sThe%20Venue%20Alexandria!5e0!3m2!1sen!2sau!4v1714808818093!5m2!1sen!2sau',
    targetNum: 5,
  },
  {
    name: 'Nouns Running Challenge - May',
    id: BigInt(2),
    duration: 'May 1 - May 30',
    verifier: '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897',
    stake: 0.025,
    donationOrg: 'Gitcoin',
    type: ChallengeTypes.Run,
    targetNum: 10,
  },
  {
    name: 'Nouns Running Challenge - June',
    id: BigInt(3),
    duration: 'June 1 - June 30',
    verifier: '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897',
    stake: 0.025,
    donationOrg: 'Gitcoin',
    type: ChallengeTypes.Run,
    targetNum: 10,
  },
];
