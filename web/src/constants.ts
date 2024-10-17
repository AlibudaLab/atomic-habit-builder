import { arbitrum, arbitrumSepolia, base, baseSepolia } from 'viem/chains';
import { DonationDest } from './types';
import { Address, zeroAddress } from 'viem';
import { getChainsForEnvironment } from './store/supportedChains';
import { Environment, getCurrentEnvironment } from './store/environment';

export const currentChainId = getChainsForEnvironment().id;

export enum ChallengeTypes {
  Run = 'Run',
  Workout = 'Workout',
  Cycling = 'Cycling',
  NFC_Chip = 'NFC Chip',
  Swim = 'Swim',
}

export const donationDestinations: DonationDest[] = [
  // {
  //   name: 'Protocol Guild',
  //   address: '0x32e3C7fD24e175701A35c224f2238d18439C7dBC',
  // },
  {
    name: 'Atomic team',
    address: '0x21a4175FdF0BC084eaA63d277212790ee6a07789',
  },
];

export const defaultVerifier = '0x29C3d6b54E2F8Ae641Fc331cF2143B6d05c97897';

export const usdcContractAddrs: Record<number, Address> = {
  [baseSepolia.id]: '0xCb5c7C676D8CcE531ceDd0fe2b4159b59607910F',
  [base.id]: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  [arbitrum.id]: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
  [arbitrumSepolia.id]: '0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d',
};

const challengeContractAddrs: Record<number, Address> = {
  [baseSepolia.id]: '0x7d1981603530aa76db92186da40092c5394b7635',
  [base.id]: '0xd909e5ed3bb25f6680505fb88434166d05a52aaa',
  [arbitrum.id]: zeroAddress,
  [arbitrumSepolia.id]: zeroAddress,
};

export const challengeAddr = challengeContractAddrs[currentChainId];

export const usdcAddr = usdcContractAddrs[currentChainId];

export const emergencySupportedChains =
  getCurrentEnvironment() === Environment.mainnet
    ? [base, arbitrum]
    : [baseSepolia, arbitrumSepolia];

export const zeroDevApiKeys: Record<number, string> = {
  // fetch the default one for base
  [baseSepolia.id]: process.env.NEXT_PUBLIC_ZERODEV_API_KEY ?? '',
  [base.id]: process.env.NEXT_PUBLIC_ZERODEV_API_KEY ?? '',
  // use the arbitrum one
  [arbitrum.id]: process.env.NEXT_PUBLIC_ZERODEV_API_KEY_ARBITRUM ?? '',
  [arbitrumSepolia.id]: process.env.NEXT_PUBLIC_ZERODEV_API_KEY_ARBITRUM ?? '',
};
