/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import * as trackerContract from '@/contracts/tracker';
import { Challenge } from '@/types';
import useRunData from '@/hooks/useRunData';
import { timeDifference } from '@/utils/time';
import Stamps from './stamps';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import Link from 'next/link';
import moment from 'moment';
import { formatDuration } from '@/utils/timestamp';

import GenerateByTrait from '@/components/Noun/GenerateByTrait';

/**
 * Running activity check-in page.
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: Challenge }) {
  const { address } = useAccount();

  const pathName = usePathname();

  const router = useRouter();

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

  const { checkedIn } = useUserChallengeCheckIns(address, challenge.id);

  const { connected, data: runData, error: runDataError } = useRunData();

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

      const fetchURL =
        '/api/sign?' +
        new URLSearchParams({
          address: address,
          activityId: runData[activityIdx].id.toString(),
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

      console.log('sig', sig);

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

      txPendingToastId = toast.loading('Sending transaction...');
    } catch (err) {
      console.log(err);
      toast.error('Error checking in');
      if (txPendingToastId) {
        toast.dismiss(txPendingToastId);
      }
    }
  };

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
      <GenerateByTrait
        properties={{
          name: 'Health',
          width: 250,
          height: 250,
          className: 'mb-3 rounded-full object-cover',
          head: 204,
          background: -1,
        }}
      />

      {/* overview   */}
      <div className="py-2">
        <p className="px-2 text-sm">
          {' '}
          Duration: {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}{' '}
        </p>
        <p className="px-2 text-sm"> Challenge: {challenge.name} </p>
      </div>

      {connected &&
        runData.map((activity, idx) => (
          <div
            key={`${activity.name}-${idx}`}
            style={{ borderColor: '#EDB830', width: '250px' }}
            className={`m-2 rounded-md border border-solid p-2 ${
              activityIdx === idx ? 'bg-yellow' : 'bg-normal'
            } items-center justify-center`}
          >
            <button type="button" onClick={() => setActivityIdx(idx)}>
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

      {connected && runData.length === 0 ? (
        <div className="p-2 text-center text-xs"> No record found </div>
      ) : connected ? (
        <div className="p-2 text-center text-xs"> Choose an activity to check in </div>
      ) : (
        <> </>
      )}

      <Stamps targetNum={challenge.targetNum} checkInNum={checkedIn} challengeId={challenge.id} />

      <div>
        {' '}
        {checkedIn.toString()} / {challenge.targetNum}{' '}
      </div>

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id}`}>
          <button
            type="button"
            className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          >
            Finish
          </button>
        </Link>
      ) : connected && !runDataError ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onClickCheckIn}
          disabled={checkInPending || isLoading || activityIdx === -1}
        >
          {' '}
          {isLoading ? 'Sending tx...' : 'Check In'}{' '}
        </button>
      ) : runDataError ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={() => router.push(`/connect-run?original_path=${pathName}`)}
        >
          Re-Connect Running App
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={() => router.push(`/connect-run?original_path=${pathName}`)}
        >
          Connect Running App
        </button>
      )}
    </div>
  );
}
