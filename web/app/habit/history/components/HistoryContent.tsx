'use client';

import { ChallengePreview } from '../../components/ChallengeBox';
import { useRouter } from 'next/navigation';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import moment from 'moment';
import { useMemo } from 'react';
import { getUserChallengeStatus } from '@/utils/challenges';
import { UserChallengeStatus } from '@/constants';

function HistoryContent() {
  const { push } = useRouter();

  const { data: challenges } = useUserChallenges();

  // all past challenges, excluding "claimable" ones
  const finishedChallenges = useMemo(
    () =>
      challenges
        ? challenges.filter(
            (c) =>
              c.endTimestamp < moment().unix() &&
              getUserChallengeStatus(c) != UserChallengeStatus.Claimable,
          )
        : [],
    [challenges],
  );

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      {/* if no challenges, show new user component */}
      <div className="flex w-full items-center justify-center">
        <p className="my-4 font-londrina text-xl font-bold">
          {' '}
          {finishedChallenges.length > 0 ? 'Challenge History' : 'No Challenge History'}{' '}
        </p>
      </div>

      {/* map challenges to list of buttons */}
      {finishedChallenges.map((challenge, idx) => (
        <button
          type="button"
          key={`link-${idx}`}
          onClick={() => push(`/habit/checkin/${challenge.id}`)}
          className="w-full no-underline transition-transform duration-200 focus:scale-105"
        >
          <ChallengePreview
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}
    </div>
  );
}

export default HistoryContent;
