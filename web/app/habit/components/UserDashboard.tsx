/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import { ChallengeBoxFilled } from './ChallengeBox';
import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
  pastChallenges: ChallengeWithCheckIns[];
};

export default function Dashboard({ onGoingChallenges, pastChallenges }: DashboardProps) {
  const { push } = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      <div className="flex w-full items-center justify-center">
        {onGoingChallenges.length > 0 && (
          <p className="my-4 font-londrina text-xl font-bold"> My Challenge </p>
        )}
      </div>

      {/* map challenges to list of buttons */}
      {onGoingChallenges.map((challenge, idx) => (
        <button
          type="button"
          key={`link-${idx}`}
          onClick={() => push(`/habit/checkin/${challenge.id}`)}
          className="w-full no-underline"
        >
          <ChallengeBoxFilled
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
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
        <button
          key={`link-${idx}`}
          onClick={() => push(`/habit/checkin/${challenge.id}`)}
          className="w-full no-underline"
        >
          <ChallengeBoxFilled
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}

      <button onClick={() => push('/habit/list')} className="my-6 py-4 text-dark">
        <p className="text-md font-bold"> Join Other Challenges </p>
      </button>
    </div>
  );
}
