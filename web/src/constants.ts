import { baseSepolia } from 'viem/chains';
import { ChallengeMetaData, DonationDest } from './types';

export const EXPECTED_CHAIN = baseSepolia;

export enum ChallengeTypes {
  Run = 'Run',
  Workout = 'Workout',
  NFC_Chip = 'NFC Chip',
}

export const donationDestinations: DonationDest[] = [
  {
    name: 'Protocol Guild',
    address: '0x32e3C7fD24e175701A35c224f2238d18439C7dBC',
  },
  {
    name: 'Alibuda',
    address: '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897',
  },
]; 

export const defaultVerifier = '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897';
