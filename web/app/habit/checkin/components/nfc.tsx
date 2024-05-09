/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { arxSignMessage, getCheckinMessage, getEncodedCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import { Challenge } from '@/hooks/useUserChallenges';
import moment from 'moment';
import Stamps from './stamps';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import Link from 'next/link';

const mental = require('@/imgs/mental.png') as string;

export default function NFCCheckIn({ challenge }: { challenge: Challenge }) {
  const { address } = useAccount();

  const {
    writeContract,
    data: dataHash,
    error: checkInError,
    isPending: checkInPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const { checkedIn } = useUserChallengeCheckIns(address, challenge.arxAddress);

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
      <Image src={mental} width="250" alt="Health" className="mb-3 rounded-full object-cover " />

      {/* overview   */}
      <div className="py-2">
        <p className="px-2 font-bold">Mental Health Habit Building</p>
        <p className="px-2 text-sm"> Duration: {challenge.duration} </p>
        <p className="px-2 text-sm"> Challenge: {challenge.name} </p>
      </div>

      <Stamps targetNum={challenge.targetNum} checkInNum={checkedIn} id={challenge.arxAddress} />

      <div>
        {' '}
        {checkedIn.toString()} / {challenge.targetNum}{' '}
      </div>

      {checkedIn >= challenge.targetNum ? (
        <Link
          href={`/habit/claim/${challenge.arxAddress}`}
        ><button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
        >
          Finish
        </button>
        </Link>
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
      )}
    </div>
  );
}
