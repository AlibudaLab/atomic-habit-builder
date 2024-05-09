/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useParams, useSearchParams } from 'next/navigation';
import { SetStateAction, useEffect } from 'react';
import { useAccount, useConnect, useWaitForTransactionReceipt } from 'wagmi';
import { arxSignMessage, getCheckinMessage, getEncodedCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import { Challenge } from '@/hooks/useUserChallenges';
import { challenges, ActivityTypes, VerificationType } from '@/constants';
import moment from 'moment';
import { wagmiConfig as config } from '@/OnchainProviders';
import { readContract } from '@wagmi/core';
import useStravaData from '@/hooks/useStravaData';
import { timeDifference } from '@/utils/time';
import StravaCheckIn from './strava';

const img = require('../../../src/imgs/step3.png') as string;

const mental = require('../../../src/imgs/mental.png') as string;
const physical = require('../../../src/imgs/physical.png') as string;

export default function CheckIn() {
  const { address } = useAccount();
  
  const { challengeId } = useParams<{ challengeId: string }>()

  console.log('challengeId', challengeId)

  const challenge = challenges.find((c) => c.arxAddress === challengeId) as Challenge;

  const [isPending, setIsPending] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessToken, setAccessToken] = useState<null | string | undefined>(null);
  const searchParams = useSearchParams();
  const stravaAuthToken = searchParams.get('code');
  const [checkedIn, setCheckedIn] = useState(0);

  const {
    writeContract,
    data: dataHash,
    error: checkInError,
    isPending: checkInPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const [stravaActivityIdx, setStravaActivityIdx] = useState(-1);

  useEffect(() => {
    console.log('selected challenge', challenge);
    const getCheckIns = async () => {
      console.log({ arxAddress: challenge.arxAddress, userAddress: address });
      const achieved = (await readContract(config, {
        abi: trackerContract.abi,
        address: trackerContract.address as `0x${string}`,
        functionName: 'getUserCheckInCounts',
        args: [challenge.arxAddress, address],
      })) as bigint;
      if (achieved) {
        const checked = Number(achieved.toString());
        setCheckedIn(checked);
      }
    };

    getCheckIns().catch((err) => {
      console.log(err);
    });
  }, [isSuccess]);

  const onClickStrava = async () => {
    
    const fetchURL =
      '/api/strava/auth?' +
      new URLSearchParams({
        redirectUri: window.location.href,
        state: `3_${challengeId}`,
      }).toString();
    console.log(fetchURL);
    const response = await (
      await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
    const authUrl = response.authUrl;
    console.log(authUrl);
    window.location = authUrl;
  };

  const { loading, data: stravaData } = useStravaData(accessToken);

  const onCheckInButtonClick = async () => {
    let nfcPendingToastId = null;
    let txPendingToastId = null;
    try {
      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }

      nfcPendingToastId = toast.loading('Sensing NFC...');
      const timestamp = moment().unix();
      const checkInMessage = getCheckinMessage(address, timestamp);
      const arxSignature = await arxSignMessage(checkInMessage);
      const signature = arxSignature.signature;
      toast.dismiss(nfcPendingToastId);
      txPendingToastId = toast.loading('Check in successful!! 🥳🥳🥳 Sending transaction...');

      writeContract({
        address: trackerContract.address as `0x${string}`,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: [
          challenge.arxAddress,
          getEncodedCheckinMessage(address, timestamp),
          signature.raw.v,
          '0x' + signature.raw.r,
          '0x' + signature.raw.s,
        ],
      });
    } catch (err) {
      console.error(err);
      toast.error('Please try to tap the NFC again');
      if (nfcPendingToastId) {
        toast.dismiss(nfcPendingToastId);
      }
      if (txPendingToastId) {
        toast.dismiss(txPendingToastId);
      }
    }
  };

  const onClickCheckinStrava = async () => {
    if (stravaActivityIdx === -1) {
      toast.error('Please select an activity');
      return;
    }

    let txPendingToastId = null;
    try {
      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }

      const fetchURL =
        '/api/sign?' +
        new URLSearchParams({
          address: address,
          activityId: stravaData[stravaActivityIdx].id.toString(),
        }).toString();
      console.log(fetchURL);

      const sig = (await (
        await fetch(fetchURL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
      ).json()) as { v: number; r: string; s: string };

      console.log('sig', sig);

      writeContract({
        address: trackerContract.address as `0x${string}`,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: [
          challenge.arxAddress,
          getEncodedCheckinMessage(address, stravaData[stravaActivityIdx].id),
          sig.v,
          '0x' + sig.r.padStart(64, '0'),
          '0x' + sig.s.padStart(64, '0'),
        ],
      });

      txPendingToastId = toast.loading('Transaction sent...');
    } catch (err) {
      console.log(err);
      toast.error('Error checking in');
      if (txPendingToastId) {
        toast.dismiss(txPendingToastId);
      }
    }
  };

  useEffect(() => {
    const handleStravaApiCall = async () => {
      if (!stravaAuthToken) {
        return; // No need to proceed if token is absent
      }

      if (refreshToken && accessToken) {
        return; // No need to proceed if we already have tokens
      }

      try {
        const fetchURL =
          '/api/strava/auth?' +
          new URLSearchParams({
            authToken: stravaAuthToken,
          }).toString();
        console.log(fetchURL);

        const response = await (
          await fetch(fetchURL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ).json();

        setRefreshToken(response.refresh_token);
        console.log('refresh token: ', response.refresh_token);
        if (response.access_token) setAccessToken(response.access_token);
        console.log('access token: ', response.access_token);
      } finally {
        setIsPending(false); // Always set loading state to false after the operation
      }
    };

    // Call the API call on component mount and whenever stravaAuthToken changes
    handleStravaApiCall().catch(console.error);
  }, [stravaAuthToken]);

  useEffect(() => {}, [refreshToken, accessToken]);

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Recorded on smart contract!! 🥳🥳🥳');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (checkInError) {
      toast.error('Error checking in.');
    }
  }, [checkInError]);

  const showStravaRecord =
  challenge.verificationType === VerificationType.Strava && accessToken !== null;

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
       <StravaCheckIn />
      }

      <Image
        src={challenge.type === ActivityTypes.Mental ? mental : physical}
        width="250"
        alt="Health"
        className="mb-3 rounded-full object-cover "
      />

      
      <div className="py-2">
        <p className="px-2 font-bold">
          {challenge.type === ActivityTypes.Mental ? 'Mental' : 'Physical'} Health Habit
          Building{' '}
        </p>
        <p className="px-2 text-sm"> Duration: {challenge.duration} </p>
        <p className="px-2 text-sm"> Challenge: {challenge.name} </p>
      </div>

      {challenge.verificationType === VerificationType.NFC && challenge.mapKey && (
        <>
          <iframe
            src={challenge.mapKey}
            title="target location"
            width="400"
            height="300"
            // allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          >
            {' '}
            cool
          </iframe>
          <div className="p-2 text-center text-xs">Scan the NFC at the pinged spot!</div>
        </>
      )}

      {showStravaRecord &&
        stravaData.map((activity, idx) => (
          <div
            key={`${activity.name}-${idx}`}
            style={{ borderColor: '#EDB830', width: '250px' }}
            className={`m-2 rounded-md border border-solid p-2 ${
              stravaActivityIdx === idx ? 'bg-yellow' : 'bg-normal'
            } items-center justify-center`}
          >
            <button type="button" onClick={() => setStravaActivityIdx(idx)}>
              <div className="px-2 text-sm font-bold"> {activity.name} </div>
              <div className="flex items-center px-2">
                <div className="px-2 text-xs"> {(activity.distance / 1000).toPrecision(2)} KM </div>
                <div className="text-grey px-2 text-xs">
                  {' '}
                  {timeDifference(Date.now(), Date.parse(activity.timestamp))}{' '}
                </div>
              </div>
            </button>
          </div>
        ))}

      {showStravaRecord && stravaData.length === 0 ? (
        <div className="p-2 text-center text-xs"> No record found </div>
      ) : (
        <div className="p-2 text-center text-xs"> Choose an activity to checkin </div>
      )}

      {/* put 10 circles indicating target number of achievements */}
      <div className="flex flex-wrap gap-4 px-12 py-6">
        {Array.from({ length: challenge.targetNum }).map((_, idx) => {
          const done = idx < checkedIn;
          const iconIdx = (Number(challenge.arxAddress) % 20) + idx;
          const icon = require(`../../../src/imgs/hats/${iconIdx + 1}.png`) as string;
          return done ? (
            <div
              style={{ borderColor: '#EDB830', paddingTop: '4px' }}
              key={`done-${idx}`}
              className="h-12 w-12 justify-center rounded-full border border-solid text-center"
            >
              {' '}
              <Image src={icon} alt="checkin" />{' '}
            </div>
          ) : (
            <div
              style={{ borderColor: 'grey', paddingTop: '10px' }}
              key={`ip-${idx}`}
              className="h-12 w-12 justify-center rounded-full border border-solid text-center "
            >
              {' '}
              {idx + 1}{' '}
            </div>
          );
        })}
      </div>

      <div>
        {' '}
        {checkedIn.toString()} / {challenge.targetNum}{' '}
      </div>

      {checkedIn >= challenge.targetNum ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          // onClick={() => setSteps(4)}
        >
          Finish
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onCheckInButtonClick}
          disabled={checkInPending || isLoading}
        >
          {' '}
          {isLoading ? 'Sending tx...' : 'Tap Here and Tap NFC'}{' '}
        </button>
      ) }
    </div>
  );
}
