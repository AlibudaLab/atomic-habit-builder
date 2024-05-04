'use client';

import { useState } from 'react';

import Step1 from './components/step1';
import Step2DepositAndStake from './components/step2stake';
import Step3CheckIn from './components/step3checkin';
import { Toaster } from 'react-hot-toast';
import LoadingCard from './components/LoadingCard';
import Image from 'next/image';
import { Challenge } from '@/hooks/useUserChallenges';

const nouns = require('../../src/imgs/nouns.png') as string;


export const challenges: Challenge[] = [
  {
    name: 'Run at Sydney Park 10 times',
    duration: 'May 1-27',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.001,
    icon: '🏃🏻‍♂️' 
  },
  {
    name: 'Run 30 mins 10 times',
    duration: 'May 6-26',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.001,
    icon: '🏃🏻‍♂️'
  },
  {
    name: 'Meet 5 new Nouns Frens',
    duration: 'May 9-15',
    arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
    stake: 0.002,
    icon: '🤝🏻'
  },
];

export default function HabitPage() {
  const [steps, setSteps] = useState(1);

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(challenges[0]);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 py-16">
      <Toaster />
      <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />

      <div className="font-title container mb-10 w-full text-center text-4xl">
        {' '}
        Alibuda Habit Builder{' '}
      </div>

      <div className="font-title px-6 pb-10 text-center text-xl">Happy Builder; Habit Builder!</div>

      {steps === 1 && <Step1 setSteps={setSteps} setChallenge={setSelectedChallenge} />}
      {steps === 2 && <Step2DepositAndStake 
        setSteps={setSteps} 
        selectedChallenge={selectedChallenge}  
        setSelectedChallenge={setSelectedChallenge}
      />}
      {steps === 3 && <Step3CheckIn setSteps={setSteps} />}

      {/* just for previewing */}
      {steps === 10 && <LoadingCard text="Message signed! The transaction is processing..." />}
    </main>
  );
}
