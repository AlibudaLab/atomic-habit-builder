/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useCallback, useState } from 'react';
import { PropagateLoader } from 'react-spinners';
import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import * as trackerContract from '@/contracts/tracker';
import { Challenge } from '@/types';
import useRunData from '@/hooks/useRunData';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import useUsedActivity from '@/hooks/useUsedActivities';
import Link from 'next/link';
import moment from 'moment';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import { getCheckInDescription } from '@/utils/challenges';
import { formatEther } from 'viem';
import { ActivityDropDown } from './activityDropdown';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';
import WaitingTx from 'app/habit/components/WaitingTx';

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: Challenge }) {
  const { address } = useAccount();

  const { activities: usedActivities, updateUsedActivities } = useUsedActivity();

  const {
    writeContract,
    data: dataHash,
    error: checkInError,
    isPending: checkInPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const [activityIdx, setActivityIdx] = useState(-1);

  const [checkInPendingId, setCheckInPendingId] = useState<string | null>(null);

  const { checkedIn } = useUserChallengeCheckIns(address, challenge.id);

  const {
    connected,
    runData,
    workoutData,
    error: runDataError,
    loading: stravaLoading,
  } = useRunData();

  const onClickCheckIn = async () => {
    if (activityIdx === -1) {
      toast.error('Please select an activity');
      return;
    }

    // todo: change this to get the timestamp of the exercise
    const timestamp = moment().unix();

    let txPendingToastId = null;
    try {
      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }

      const activityId =
        challenge.type === ChallengeTypes.Run
          ? runData[activityIdx].id
          : workoutData[activityIdx].id;

      const fetchURL =
        '/api/sign?' +
        new URLSearchParams({
          address: address,
          activityId: activityId.toString(),
          timestamp: timestamp.toString(),
          challengeId: challenge.id.toString(),
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

      writeContract({
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: [
          challenge.id,
          BigInt(timestamp),
          sig.v,
          ('0x' + sig.r.padStart(64, '0')) as `0x${string}`,
          ('0x' + sig.s.padStart(64, '0')) as `0x${string}`,
        ],
      });

      setCheckInPendingId(activityId.toString());

      txPendingToastId = toast.loading('Sending transaction...');
    } catch (err) {
      console.log(err);
      toast.error('Error checking in');
    } finally {
      if (txPendingToastId) {
        toast.dismiss(txPendingToastId);
      }
    }
  };

  // only show this button if user is not connected to strava
  const onClickConnectStrava = useCallback(() => {
    // path that user will be redirected to after connecting to strava
    const redirectUri = window.origin + '/connect-run/strava';

    // after verification on the connect-run/strava page, direct back to this page
    const authUrl = stravaUtils.getAuthURL(redirectUri, window.location.href);
    window.location = authUrl as any;
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast.dismiss();
      toast.success('Successfully checked in!! 🥳🥳🥳');

      if (checkInPendingId) updateUsedActivities(checkInPendingId);
      setActivityIdx(-1);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (checkInError) {
      toast.error('Error checking in.');
    }
  }, [checkInError]);

  return (
    <div className="flex max-w-96 flex-col items-center justify-center">
      {/* overview   */}
      <ChallengeBoxFilled challenge={challenge} checkedIn={checkedIn} />

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Goal </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
      </div>

      {/* checkIn description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Check In </div>
        <div className="text-sm text-primary"> {getCheckInDescription(challenge.type)} </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Stake Amount </div>
        <div className="text-sm text-primary"> {`${formatEther(challenge.stake)} ALI`} </div>
      </div>

      {connected && (
        <div className="flex w-full justify-center px-2 pt-4">
          <ActivityDropDown
            loading={stravaLoading}
            setActivityIdx={setActivityIdx}
            activityIdx={activityIdx}
            activities={challenge.type === ChallengeTypes.Run ? runData : workoutData}
            usedActivities={usedActivities}
          />
        </div>
      )}

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id}`}>
          <button
            type="button"
            className="wrapped mt-12 rounded-lg px-6 py-2 font-bold text-primary transition-transform duration-300 focus:scale-105"
          >
            Finish
          </button>
        </Link>
      ) : connected && !runDataError ? (
        <button
          type="button"
          className="wrapped mt-12  w-3/4 max-w-56 rounded-lg px-12 py-2 font-bold text-primary transition-transform duration-300 focus:scale-105 disabled:opacity-50"
          onClick={onClickCheckIn}
          disabled={checkInPending || isLoading || activityIdx === -1}
        >
          {' '}
          {isLoading ? <WaitingTx /> : 'Check In'}{' '}
        </button>
      ) : (
        <button
          type="button"
          className="wrapped mt-12 rounded-lg px-6 py-2 font-bold text-primary transition-transform duration-300 focus:scale-105"
          onClick={onClickConnectStrava}
        >
          Connect with Strava
        </button>
      )}
    </div>
  );
}
