'use client';

import useUserChallenges, { Challenge } from '@/hooks/useUserChallenges';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

import Step1Join from './step1join';
import Step1List from './step1list';

export default function Step1({ setSteps, setChallenge }: { 
  setSteps: React.Dispatch<SetStateAction<number>>,
  setChallenge: React.Dispatch<SetStateAction<Challenge>>,
}) {
  const { address } = useAccount();

  const { data: challenges } = useUserChallenges(address);

  return (
    <div className="flex flex-col items-center justify-center">
      {!address ? (
        <Step1Join setSteps={setSteps} />
      ) : (
        <Step1List setSteps={setSteps} challenges={challenges} setChallenge={setChallenge} />
      )}
    </div>
  );
}
