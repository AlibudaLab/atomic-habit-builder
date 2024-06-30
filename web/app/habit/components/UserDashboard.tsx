/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import Link from 'next/link';
import { ChallengeBoxFilled } from './ChallengeBox';
import { Divider } from '@nextui-org/react';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
  pastChallenges: ChallengeWithCheckIns[];
};

export default function Dashboard({ onGoingChallenges, pastChallenges }: DashboardProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-start">
      <div className="flex w-full items-center justify-center">
        {onGoingChallenges.length > 0 && (
          <p className="my-4 font-londrina text-xl font-bold"> Challenge List </p>
        )}
      </div>

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

      <div className="flex w-full items-center justify-center">
        {pastChallenges.length > 0 && (
          <div className="flex w-full items-center justify-center gap-4">
            <Divider className="w-1/4" />
            <p className="my-4 font-londrina text-base"> Past challenges </p>
            <Divider className="w-1/4" />
          </div>
        )}
      </div>
      {pastChallenges.map((challenge, idx) => (
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

      <Link href="/habit/list" className="my-6 py-4 text-dark">
        <p className="text-md font-bold"> Join Other Challenges </p>
      </Link>
    </div>
  );
}
