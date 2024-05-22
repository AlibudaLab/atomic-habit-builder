'use client';

import { Challenge } from '@/types';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

import Step4Claim from '../claim/components/claim';
import Step4Failed from './step4failed';

export default function Step4({
  setSteps,
  challenge,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  challenge: Challenge;
}) {
  const { address } = useAccount();

  // TODO: decide if user has completed or failed the message
  const success = true;

  return (
    <div className="flex flex-col items-center justify-center">
      <Step4Failed setSteps={setSteps} challenge={challenge} />
    </div>
  );
}
