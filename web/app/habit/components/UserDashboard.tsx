/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import { ChallengePreview } from './ChallengeBox';
import { useRouter } from 'next/navigation';
import NewUser from './NewUser';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
};

export default function Dashboard({ onGoingChallenges }: DashboardProps) {
  const { push } = useRouter();

  // const totalChallenges = onGoingChallenges.length + pastChallenges.length;

  return onGoingChallenges.length === 0 ? (
    <NewUser />
  ) : (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      {/* if no challenges, show new user component */}
      <div className="flex w-full items-center justify-center">
        {onGoingChallenges.length > 0 && (
          <p className="my-4 font-londrina text-xl font-bold"> My Challenges </p>
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
          <ChallengePreview
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}

      {/* <button onClick={() => push('/habit/list')} className="my-6 py-4 text-dark">
        <p className="text-md font-bold"> Join Other Challenges </p>
      </button> */}
    </div>
  );
}
