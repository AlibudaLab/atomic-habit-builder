/* eslint-disable */
'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import Link from 'next/link';
import toast from 'react-hot-toast';

type DashboardProps = {
  challenges: Challenge[];
};

export default function Dashboard({ challenges }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Only show challenges */}
      <div className="flex w-full items-center justify-center gap-6 text-center">
        { challenges.length > 0 
          && (<p className="text-lg"> My Ongoing Challenges </p>)
        }
      </div>

      {/* map challenges to list of buttons */}
      {challenges.map((challenge, idx) => (
        <Link key={`link-${idx}`} href={`/habit/checkin/${challenge.arxAddress}`}>
          <button
            key={challenge.arxAddress}
            type="button"
            className="mt-4 w-full rounded-lg px-6 py-3 outline-2 outline"
            style={{ borderColor: '#EDB830', width: '350px', height: '60px' }}
          >
            <div className="flex w-full justify-between">
              <div className="mr-4 text-2xl">{challenge.icon}</div>
              <div className="justify-left items-start hover:text-black">
                <div className="flex text-sm">{challenge.duration} </div>
                <div className="flex text-sm">{challenge.name} </div>
              </div>
              <div className="text-lg">
                {' '}
                {challenge.checkedIn?.toString()}/ {challenge.targetNum}{' '}
              </div>
            </div>
          </button>

          {/* Space Divier */}
          <div className='py-12'></div>

          
        </Link>
      ))}

      <Link href="/habit/stake">
        <button
          type="button"
          className="mt-4 rounded-lg outline-dotted outline-2	px-6 py-3"
          style={{ width: '350px', height: '80px' }}
        >
          <p className='font-bold text-md'> Join a Challenge </p>
          <p className='text-sm'> Join on-going challenges </p>
        </button>
      </Link>

      <Link href={''} onClick={() => toast('Coming soon')}>
        <button
          type="button"
          className="mt-4 rounded-lg outline-dotted outline-2 px-6 py-3 "
          style={{ width: '350px', height: '80px' }}
        >
          <p className='font-bold text-md'> Create a New Challenge{' '} </p>
          <p className='text-sm'> Create a new challenge and share! </p>
        </button>
      </Link>
    </div>
  );
}
