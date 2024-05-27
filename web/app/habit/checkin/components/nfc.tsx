/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import moment from 'moment';
import { Challenge } from '@/types';
import { getCheckInDescription } from '@/utils/challenges';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import useCheckIn from '@/hooks/transaction/useCheckIn';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';

export default function NFCCheckIn({ challenge }: { challenge: Challenge }) {
  const { address } = useAccount();

  const [timestamp, setTimestamp] = useState<number>(0);
  const [v, setV] = useState<number>(0);
  const [r, setR] = useState<string>('');
  const [s, setS] = useState<string>('');

  const {
    onSubmitTransaction: onCheckInTx,
    isPreparing: isCheckInPreparing,
    isLoading: isCheckInLoading,
  } = useCheckIn(
    challenge.id,
    BigInt(timestamp),
    v,
    ('0x' + r) as `0x${string}`,
    ('0x' + s) as `0x${string}`,
  );

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
      setTimestamp(moment().unix());
      const checkInMessage = getCheckinMessage(address, timestamp);
      const arxSignature = await arxSignMessage(checkInMessage);
      setV(arxSignature.signature.raw.v);
      setR('0x' + arxSignature.signature.raw.r);
      setS('0x' + arxSignature.signature.raw.s);
      toast.dismiss(nfcPendingToastId);
      txPendingToastId = toast.loading('Check in successful!! 🥳🥳🥳 Sending transaction...');

      onCheckInTx();
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
          disabled={isCheckInPreparing || isCheckInLoading}
        >
          {' '}
          {isCheckInLoading ? 'Sending tx...' : 'Click & Tap NFC'}{' '}
        </button>
      )}
    </div>
  );
}
