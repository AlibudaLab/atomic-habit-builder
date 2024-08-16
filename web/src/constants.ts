import { base, baseSepolia } from 'viem/chains';
import { DonationDest } from './types';
import { Address, getChainContractAddress, zeroAddress } from 'viem';
import { getChainsForEnvironment } from './store/supportedChains';

const currentChainId = getChainsForEnvironment().id;

export enum ChallengeTypes {
  Run = 'Run',
  Workout = 'Workout',
  Cycling = 'Cycling',
  NFC_Chip = 'NFC Chip',
}

export const donationDestinations: DonationDest[] = [
  // {
  //   name: 'Protocol Guild',
  //   address: '0x32e3C7fD24e175701A35c224f2238d18439C7dBC',
  // },
  {
    name: 'Alibuda',
    address: '0x21a4175FdF0BC084eaA63d277212790ee6a07789',
  },
];

export const defaultVerifier = '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897';

const usdcContractAddrs: Record<number, Address> = {
  [baseSepolia.id]: '0xCb5c7C676D8CcE531ceDd0fe2b4159b59607910F',
  [base.id]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
};

const challengeContractAddrs: Record<number, Address> = {
  [baseSepolia.id]: '0x7d1981603530aa76db92186da40092c5394b7635',
  [base.id]: '0xd909e5ed3bb25f6680505fb88434166d05a52aaa',
};

export const challengeAddr = challengeContractAddrs[currentChainId];

export const usdcAddr = usdcContractAddrs[currentChainId];
