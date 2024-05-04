'use client';

import useUserChallenges, { Challenge } from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

const img = require('../../../src/imgs/failed.png') as string;

export default function Step4Failed({
  setSteps,
  challenge
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  challenge: Challenge
}) {
  const { address } = useAccount();
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-center">
        <p className="text-xl p-6 pt-2 font-bold"> You didn’t complete the challenge </p>
      </div>

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => setSteps(2)}
      >
        Start a new Challenge
      </button>

      <div className='text-xs p-4'>
      50% of the stake is donated to { challenge.donationOrg ?? 'public good' }. Thank you for your contribution! !
      </div>

      <Image
        src={img}
        width="440"
        height="440"
        alt="Step 4 Image"
        className="mb-3 object-cover"
        />
    </div>
  );
}