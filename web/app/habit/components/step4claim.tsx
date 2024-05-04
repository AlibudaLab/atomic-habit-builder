'use client';

import { challenges } from '@/constants';
import useUserChallenges, { Challenge } from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

const img = require('../../../src/imgs/success.png') as string;

export default function Step4Claim({
  challenge,
  setSteps,
}: {
  challenge: Challenge,
  setSteps: React.Dispatch<SetStateAction<number>>;
}) {
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-center">
        <p className="text-xl p-6 pt-2 font-bold"> Congratulations on Winning the Habit Building Challenge! </p>
      </div>

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => console.log('claim')}
      >
        Claim Rewards
      </button>

      <div className='text-xs p-4'>
        Get back {challenge.stake} ETH and 1 NFT Badge
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
