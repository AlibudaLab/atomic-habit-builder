'use client';

import { useState } from 'react';

import Step1 from './components/step1';
import Step2DepositAndStake from './components/step2stake';
import Step3CheckIn from './components/step3checkin';
import Step4 from './components/step4';
import { Toaster } from 'react-hot-toast';
import LoadingCard from './components/LoadingCard';
import Image from 'next/image';
import { Challenge } from '@/hooks/useUserChallenges';

const nouns = require('../../src/imgs/nouns.png') as string;

import { challenges } from '@/constants';
import { useSearchParams } from 'next/navigation';

export default function HabitPage() {
  const searchParams = useSearchParams();
  const state = searchParams.get('state') ?? '1_0';

  const currentStep = parseInt(state.split('_')[0]);
  const currentChallengeId = parseInt(state.split('_')[1]);

  const [steps, setSteps] = useState(currentStep);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>(
    challenges[currentChallengeId],
  );

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
      {steps === 2 && (
        <Step2DepositAndStake
          setSteps={setSteps}
          selectedChallenge={selectedChallenge}
          setSelectedChallenge={setSelectedChallenge}
        />
      )}
      {steps === 3 && <Step3CheckIn setSteps={setSteps} selectedChallenge={selectedChallenge} />}
      {steps === 4 && <Step4 setSteps={setSteps} challenge={selectedChallenge} />}

      {/* just for previewing */}
      {steps === 10 && <LoadingCard text="Message signed! The transaction is processing..." />}
    </main>
  );
}
