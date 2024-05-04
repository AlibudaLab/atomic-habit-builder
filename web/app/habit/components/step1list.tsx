'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import { SetStateAction } from 'react';

/**
 * Show list of activities signed in
 * @param param0
 * @returns
 */
export default function Step1BList({
  setSteps,
  challenges,
  setChallenge,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  setChallenge: React.Dispatch<SetStateAction<Challenge>>;
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
          className="mt-4 w-full rounded-lg px-6 py-3"
          style={{ borderColor: '#EDB830', border: 'solid', width: '350px', height: '60px' }}
          onClick={() => setSteps(3)}
        >
          <div className="flex w-full justify-between">
            <div className="mr-4 text-2xl">{challenge.icon}</div>
            <div className='justify-left items-start hover:text-black'>
              <div className='text-sm flex'>{challenge.duration} </div>
              <div className='text-sm flex'>{challenge.name} </div>
            </div>
            <div className="text-xl"> 1/ 10 </div>
          </div>
        </button>
      ))}

      <button
        type="button"
        className="mt-4 rounded-lg border-solid px-6 py-3 font-bold"
        style={{ width: '300px', height: '50px' }}
        onClick={() => setSteps(2)}
      >
        Join a New Challenge{' '}
      </button>
    </div>
  );
}
