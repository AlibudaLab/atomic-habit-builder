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

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenges } = useAllChallenges();

  const challenge = challenges.find((c) => c.id.toString() === challengeId) as Challenge;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      
      {challenge ? (
        <>
          {challenge.type === ChallengeTypes.Run && <RunCheckIn challenge={challenge} />}

          {challenge.type === ChallengeTypes.NFC_Chip && <NFCCheckIn challenge={challenge} />}
        </>
      ) : (
        <>Loading Challenges</>
      )}
    </div>
  );
}
