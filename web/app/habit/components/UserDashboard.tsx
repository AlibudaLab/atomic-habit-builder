/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import { challengeToEmoji } from '@/utils/challenges';
import { formatDuration } from '@/utils/timestamp';
import Link from 'next/link';
import { ChallengeBoxFilled } from './ChallengeBox';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
};

export default function Dashboard({ onGoingChallenges }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Only show challenges */}
      <div className="flex w-full items-center justify-center gap-6 text-center">
        {onGoingChallenges.length > 0 && <p className="text-lg"> My Ongoing Challenges </p>}
      </div>

      {/* map challenges to list of buttons */}
      {onGoingChallenges.map((challenge, idx) => (
        <Link key={`link-${idx}`} href={`/habit/checkin/${challenge.id}`} className="no-underline w-full">
          <ChallengeBoxFilled
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </Link>
      ))}

      {/* Space Divider */}
      <div className="py-12"></div>

      <Link href="/habit/list">
        <button type="button" className="wrapped text-primary w-full max-w-96 rounded-lg px-6 py-3">
          <p className="text-md font-bold"> Join a new Challenge </p>
        </button>
      </Link>
    </div>
  );
}
