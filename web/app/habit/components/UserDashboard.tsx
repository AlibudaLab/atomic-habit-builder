/* eslint-disable */
'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import Link from 'next/link';

type DashboardProps = {
  challenges: Challenge[];
};

export default function Dashboard({ challenges }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="flex w-full items-center justify-center gap-6 text-center">
        <p className="text-lg"> Ongoing Challenges</p>
      </div>

      {/* map challenges to list of buttons */}
      {challenges.map((challenge, idx) => (
        <Link key={`link-${idx}`} href={`/habit/checkin/${challenge.arxAddress}`}>
          <button
            key={challenge.arxAddress}
            type="button"
            className="mt-4 w-full rounded-lg px-6 py-3"
            style={{ borderColor: '#EDB830', border: 'solid', width: '350px', height: '60px' }}
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
        </Link>
      ))}

      <Link href="/habit/stake">
        <button
          type="button"
          className="mt-4 rounded-lg border-solid px-6 py-3 text-sm font-bold"
          style={{ width: '300px', height: '50px' }}
        >
          Join a New Challenge{' '}
        </button>
      </Link>
    </div>
  );
}
