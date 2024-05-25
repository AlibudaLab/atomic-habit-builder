/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import Link from 'next/link';
import { ChallengeBoxFilled } from './ChallengeBox';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
};

export default function Dashboard({ onGoingChallenges }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex w-full items-center justify-center gap-6 text-center">
        {onGoingChallenges.length > 0 && <p className="text-xl"> Challenges you Joined </p>}
      </div>

      <Link href="/habit/list" className="my-6 py-4 text-primary">
        <p className="text-md font-bold"> Join Other Challenges </p>
      </Link>

      {/* map challenges to list of buttons */}
      {onGoingChallenges.map((challenge, idx) => (
        <Link
          key={`link-${idx}`}
          href={`/habit/checkin/${challenge.id}`}
          className="w-full no-underline"
        >
          <ChallengeBoxFilled
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </Link>
      ))}
    </div>
  );
}
