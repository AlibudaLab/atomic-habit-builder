/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useParams } from 'next/navigation';
import { ChallengeTypes } from '@/constants';
import RunCheckIn from './checkinRun';
import NFCCheckIn from './nfc';
import useChallenge from '@/hooks/useChallenge';
import Loading from 'app/habit/components/Loading';
import NavbarFooter from 'app/habit/components/NavbarFooter';

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge, loading } = useChallenge(Number(challengeId));

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 text-center font-londrina text-xl font-bold">
        {' '}
        Happy Builder; Habit Builder!{' '}
      </p>

      {loading ? (
        <Loading />
      ) : challenge ? (
        <>
          {(challenge.type === ChallengeTypes.Run || challenge.type === ChallengeTypes.Workout) && (
            <RunCheckIn challenge={challenge} />
          )}

          {challenge.type === ChallengeTypes.NFC_Chip && <NFCCheckIn challenge={challenge} />}
        </>
      ) : (
        <div className="text-center"> Challenge not found </div>
      )}

      <NavbarFooter />
    </div>
  );
}
