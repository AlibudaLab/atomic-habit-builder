import { baseSepolia } from 'viem/chains';
import { Challenge } from './hooks/useUserChallenges';

export const EXPECTED_CHAIN = baseSepolia;

export const TESTING_CHALLENGE_ADDRESS = '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299';

export const challenges: Challenge[] = [
  {
    name: 'Run at Sydney Park 10 times',
    duration: 'May 1-27',
    arxAddress: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299',
    stake: 0.001,
    icon: '🏃🏻‍♂️' 
  },
  {
    name: 'Run 30 mins 10 times',
    duration: 'May 6-26',
    arxAddress: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299',
    stake: 0.001,
    icon: '🏃🏻‍♂️'
  },
  {
    name: 'Meet 5 new Nouns Frens',
    duration: 'May 9-15',
    arxAddress: '0x883167E6b5d489B82cB97bEf9C7967afe3A3D299',
    stake: 0.002,
    icon: '🤝🏻'
  },
];