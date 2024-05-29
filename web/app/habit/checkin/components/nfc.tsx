/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useEffect } from 'react';
import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import * as trackerContract from '@/contracts/tracker';
import { Challenge } from '@/types';
import moment from 'moment';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import Link from 'next/link';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import { getCheckInDescription } from '@/utils/challenges';
import { formatEther } from 'viem';

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

  const { checkedIn } = useUserChallengeCheckIns(address, challenge.id);

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
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: [
          challenge.id,
          BigInt(timestamp),
          signature.raw.v,
          ('0x' + signature.raw.r) as `0x${string}`,
          ('0x' + signature.raw.s) as `0x${string}`,
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
      toast.success('Successfully checked in!! 🥳🥳🥳');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (checkInError) {
      toast.error('Error checking in.');
    }
  }, [checkInError]);

  return (
    <div className="flex flex-col items-center justify-center">
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

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id.toString()}`}>
          <button
            type="button"
            className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white transition-transform duration-300 hover:scale-105"
          >
            Finish
          </button>
        </Link>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-6 py-4 font-bold text-white transition-transform duration-300 hover:scale-105"
          onClick={onCheckInButtonClick}
          disabled={checkInPending || isLoading}
        >
          {' '}
          {isLoading ? 'Sending tx...' : 'Click & Tap NFC'}{' '}
        </button>
      )}
    </div>
  );
}
