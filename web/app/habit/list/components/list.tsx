import { clsx } from 'clsx';
import { SetStateAction, useState } from 'react';
import { challengeToEmoji } from '@/utils/challenges';
import { Challenge } from '@/types';
import useAllChallenges from '@/hooks/useAllChallenges';
import { formatDuration } from '@/utils/timestamp';
import Link from 'next/link';

export function ChallengeButtonList() {
  const { challenges } = useAllChallenges();

  return challenges.map((challenge) => (
    <Link
      // label={challenge.name}
      key={challenge.id.toString()}
      href={`/habit/stake/${challenge.id}`}
    >
      <button
        type="button"
        className="text-primary w-3/4 m-2 wrapped"
        style={{ borderColor: 'text-primary' }}
        
      >
        <div className="flex w-full items-center justify-start">
          <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
          <div className="flex flex-col items-start justify-start p-2">
            <p className="text-xs opacity-80">
              {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
            </p>
            <p className="text-sm font-bold text-start">{challenge.name}</p>
            <p className="text-sm"> 5 joined </p>
          </div>
          <div className="ml-auto text-sm p-2">{challenge.targetNum} times</div>
        </div>
      </button>
    </Link>
  ));
}
