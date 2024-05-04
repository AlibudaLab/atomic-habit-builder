import { baseSepolia } from 'viem/chains';
import { Challenge } from './hooks/useUserChallenges';

export const EXPECTED_CHAIN = baseSepolia;

export const TESTING_CHALLENGE_ADDRESS = '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299';

export enum ActivityTypes {
  'Mental',
  'Physical'
}

export enum VerificationType {
  'NFC',
  'Strava'
}

export const challenges: Challenge[] = [
  {
    name: 'Run at Sydney Park 10 times',
    duration: 'May 1-27',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.001,
    icon: '🏃🏻‍♂️',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Physical,
    verificationType: VerificationType.NFC,
    mapKey: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13244.864971609879!2d151.1851663!3d-33.9098337!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b04b8d42ec9f%3A0x2f847bc8689ddf4e!2sSydney%20Park!5e0!3m2!1sen!2sau!4v1714806603540!5m2!1sen!2sau'
  },
  {
    name: 'Run 30 mins 10 times',
    duration: 'May 6-26',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.001,
    icon: '🏃🏻‍♂️',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Physical,
    verificationType: VerificationType.NFC
  },
  {
    name: 'Meet 5 new Nouns Frens',
    duration: 'May 9-15',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.002,
    icon: '🤝🏻',
    donationOrg: 'Gitcoin',
    type: ActivityTypes.Mental,
    verificationType: VerificationType.NFC
  },
];