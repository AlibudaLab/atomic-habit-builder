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
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import Link from 'next/link';
import moment from 'moment';
import { formatDuration } from '@/utils/timestamp';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import { getCheckInDescription } from '@/utils/challenges';
import { formatEther } from 'viem';
import { ActivityDropDown } from './activityDropdown';

import GenerateByTrait from '@/components/Nouns/GenerateByTrait';

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
    <div className="flex flex-col items-center justify-center max-w-96">

      {/* overview   */}
      <ChallengeBoxFilled challenge={challenge} checkedIn={checkedIn} />

      {/* goal description */}
      <div className="justify-start p-6 py-2 text-start w-full">
        <div className="text-dark pb-2 text-xl font-bold"> Description </div>
        <div className="text-dark text-sm"> {challenge.description} </div>
      </div>

      {/* checkIn description */}
      <div className="justify-start p-6 pb-2 text-start w-full">
        <div className="text-dark pb-2 text-xl font-bold"> Check In </div>
        <div className="text-dark text-sm"> {getCheckInDescription(challenge.type)} </div>
      </div>

      {connected && runData.length === 0 ? (
        <div className="pt-6 p-2 text-center text-sm"> No record found </div>
      ) : connected ? (
        <div className='w-full flex justify-center'>
      <ActivityDropDown
        setActivityIdx={setActivityIdx}
        activityIdx={activityIdx}
        activities={runData}
        />
        </div>
      ) : (
        <> </>
      )}

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id}`}>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white hover:scale-105 transition-transform duration-300"
          >
            Finish
          </button>
        </Link>
      ) : connected && !runDataError ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white hover:scale-105 transition-transform duration-300"
          onClick={onClickCheckIn}
          disabled={checkInPending || isLoading || activityIdx === -1}
        >
          {' '}
          {isLoading ? 'Sending tx...' : 'Check In'}{' '}
        </button>
      ) : runDataError ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white "
          onClick={() => router.push(`/connect-run?original_path=${pathName}`)}
        >
          Re-Connect Running App
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white "
          onClick={() => router.push(`/connect-run?original_path=${pathName}`)}
        >
          Connect Running App
        </button>
      )}
    </div>
  );
}
