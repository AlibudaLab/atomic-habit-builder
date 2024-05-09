/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import { Challenge } from '@/hooks/useUserChallenges';
import { challenges, VerificationType } from '@/constants';
import { timeDifference } from '@/utils/time';
import StravaCheckIn from './strava';
import NFCCheckIn from './nfc';

const img = require('../../../src/imgs/step3.png') as string;


export default function CheckIn() {
  
  const { challengeId } = useParams<{ challengeId: string }>()
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

      { challenge.verificationType === VerificationType.Strava &&
       <StravaCheckIn challenge={challenge} />
      }

      { challenge.verificationType === VerificationType.NFC && 
      <NFCCheckIn challenge={challenge} /> }
    </div>
  );
}
