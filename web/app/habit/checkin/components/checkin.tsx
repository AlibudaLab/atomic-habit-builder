/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Challenge } from '@/types';
import { ChallengeTypes } from '@/constants';
import RunCheckIn from './checkinRun';
import NFCCheckIn from './nfc';
import useAllChallenges from '@/hooks/useAllChallenges';
import useChallenge from '@/hooks/useChallenge';

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge } = useChallenge(Number(challengeId));

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 pt-2 text-lg"> Happy Builder; Habit Builder! </p>

      {challenge ? (
        <>
          {(challenge.type === ChallengeTypes.Run || challenge.type === ChallengeTypes.Workout) && (
            <RunCheckIn challenge={challenge} />
          )}

          {challenge.type === ChallengeTypes.NFC_Chip && <NFCCheckIn challenge={challenge} />}
        </>
      ) : (
        <>Loading Challenge Detail</>
      )}
    </div>
  );
}
