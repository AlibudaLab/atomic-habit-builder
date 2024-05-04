'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

import Step1Join from './step1join';
import Step1List from './step1list';

export default function Step1({ setSteps }: { setSteps: React.Dispatch<SetStateAction<number>> }) {
  const { address } = useAccount();

  console.log('has logined address??', address);

  const { data: challenges } = useUserChallenges(address);

  console.log('challenges', challenges);

  return (
    <div className="flex flex-col items-center justify-center">
      {!address ? (
        <Step1Join setSteps={setSteps} />
      ) : (
        <Step1List setSteps={setSteps} challenges={challenges} />
      )}
    </div>
  );
}
