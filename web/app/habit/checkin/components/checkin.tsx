/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { Challenge } from '@/hooks/useUserChallenges';
import { challenges, ChallengeTypes } from '@/constants';
import RunCheckIn from './checkinRun';
import NFCCheckIn from './nfc';

const img = require('@/imgs/step3.png') as string;

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const challenge = challenges.find((c) => c.arxAddress === challengeId) as Challenge;

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="flex items-center gap-6">
        <Image
          src={img}
          width="50"
          alt="Step 2 Image"
          className="mb-3 rounded-full object-cover "
        />
        <p className="mr-auto text-lg ">Check in every day</p>
      </div>

      {challenge.type === ChallengeTypes.Run && (
        <RunCheckIn challenge={challenge} />
      )}

      {challenge.type === ChallengeTypes.NFC_Chip && <NFCCheckIn challenge={challenge} />}
    </div>
  );
}
