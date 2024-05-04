/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
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

const img = require('../../../src/imgs/step3.png') as string;

const mental = require('../../../src/imgs/mental.png') as string;
const physical = require('../../../src/imgs/physical.png') as string;

export default function Step3CheckIn({
  setSteps,
  selectedChallenge,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  selectedChallenge: Challenge;
}) {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
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

  useEffect(() => {
    const getCheckIns = async () => {
      const achieved = (await readContract(config, {
        abi: trackerContract.abi,
        address: trackerContract.address as `0x${string}`,
        functionName: 'getUserCheckInCounts',
        args: [selectedChallenge.arxAddress, address],
      })) as bigint;
      if (achieved) {
        const checked = Number(achieved.toString());
        setCheckedIn(checked);
      }
    };

    getCheckIns().catch((err) => {
      console.log(err);
      toast.error('Error getting checkins');
    });
  }, [isSuccess]);

  const onClickStrava = async () => {
    const currentChallengeId = challenges.findIndex(
      (obj) => obj.arxAddress === selectedChallenge.arxAddress,
    );

    const fetchURL =
      '/api/strava/auth?' +
      new URLSearchParams({
        redirectUri: window.location.href,
        state: `3_${currentChallengeId}`,
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
          selectedChallenge.arxAddress,
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
        setAccessToken(response.access_token);
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

      <Image
        src={selectedChallenge.type === ActivityTypes.Mental ? mental : physical}
        width="250"
        alt="Health"
        className="mb-3 rounded-full object-cover "
      />

      {/* overview   */}
      <div className="py-2">
        <p className="px-2 font-bold">
          {selectedChallenge.type === ActivityTypes.Mental ? 'Mental' : 'Physical'} Health Habit
          Building{' '}
        </p>
        <p className="px-2 text-sm"> Duration: {selectedChallenge.duration} </p>
        <p className="px-2 text-sm"> Challenge: {selectedChallenge.name} </p>
      </div>

      {selectedChallenge.verificationType === VerificationType.NFC && selectedChallenge.mapKey && (
        <>
          <iframe
            src={selectedChallenge.mapKey}
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

      {/* put 10 circles indicating target number of achievements */}
      <div className="flex flex-wrap gap-4 px-12 py-6">
        {Array.from({ length: selectedChallenge.targetNum }).map((_, idx) => {
          const done = idx < checkedIn;
          const iconIdx = (Number(selectedChallenge.arxAddress) % 20) + idx;
          const icon = require(`../../../src/imgs/hats/${iconIdx + 1}.png`) as string;
          return done ? (
            <div
              style={{ borderColor: '#EDB830', paddingTop: '4px' }}
              key="{idx}"
              className="h-12 w-12 justify-center rounded-full border border-solid text-center"
            >
              {' '}
              <Image src={icon} alt="checkin" />{' '}
            </div>
          ) : (
            <div
              style={{ borderColor: 'grey', paddingTop: '10px' }}
              key="{idx}"
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
        {checkedIn.toString()} / {selectedChallenge.targetNum}{' '}
      </div>

      {selectedChallenge.verificationType === VerificationType.NFC ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onCheckInButtonClick}
          disabled={checkInPending || isLoading}
        >
          {' '}
          {isLoading ? 'Sending tx...' : 'Tap Here and Tap NFC'}{' '}
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onClickStrava}
        >
          Connect Strava
        </button>
      )}

      {checkedIn > selectedChallenge.targetNum && (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={() => setSteps(4)}
        >
          Finish
        </button>
      )}
    </div>
  );
}
