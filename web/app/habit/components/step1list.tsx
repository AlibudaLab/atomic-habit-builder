'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useConnect } from 'wagmi';

const img = require('../../../src/imgs/step1.png') as string;

/**
 * Show list of activities signed in
 * @param param0
 * @returns
 */
export default function Step1BList({
  setSteps,
  challenges,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  challenges: Challenge[];
}) {
  console.log('challenges here', challenges.length);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="flex w-full items-center justify-center gap-6 text-center">
        <p className="text-lg"> Ongoing Challenges</p>
      </div>

      {/* map challenges to list of buttons */}
      {challenges.map((challenge) => (
        <button
          key={challenge.arxAddress}
          type="button"
          className="mt-4 rounded-lg px-6 py-3 font-bold"
          style={{ borderColor: '#EDB830', border: 'solid', width: '250px', height: '50px' }}
          onClick={() => setSteps(3)}
        >
          Check-in {challenge.name}{' '}
        </button>
      ))}

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg border-solid px-6 py-3 font-bold"
        style={{ color: 'white', border: 'solid', width: '250px', height: '50px' }}
        onClick={() => setSteps(2)}
      >
        Join a New Challenge{' '}
      </button>
    </div>
  );
}
