'use client';

import { useParams } from 'next/navigation';
import { ChallengeTypes } from '@/constants';
import RunCheckIn from './checkinRun';
import NFCCheckIn from './nfc';
import useChallenge from '@/hooks/useChallenge';
import Loading from 'app/habit/components/Loading';

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge, loading } = useChallenge(Number(challengeId));

  return (
    <div className="flex h-screen flex-col items-center px-2">
      <p className="pb-4 text-center font-londrina text-xl font-bold">
        {' '}
        Happy Builder; Habit Builder!{' '}
      </p>

      {loading ? (
        <Loading />
      ) : challenge ? (
        <>
          {(challenge.type === ChallengeTypes.Run ||
            challenge.type === ChallengeTypes.Workout ||
            challenge.type === ChallengeTypes.Cycling) && <RunCheckIn challenge={challenge} />}

          {challenge.type === ChallengeTypes.NFC_Chip && <NFCCheckIn challenge={challenge} />}
        </>
      ) : (
        <div className="text-center"> Challenge not found </div>
      )}
    </div>
  );
}
