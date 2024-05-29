/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { Challenge } from '@/types';
import { getCheckInDescription } from '@/utils/challenges';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import useCheckInNFC from '@/hooks/transaction/useCheckInNFC';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';

export default function NFCCheckIn({ challenge }: { challenge: Challenge }) {
  const { address } = useAccount();
  const [tapNFC, setTapNFC] = useState(false);

  const {
    checkIn: {
      onSubmitTransaction: onCheckInTx,
      isPreparing: isCheckInPreparing,
      isLoading: isCheckInLoading,
    },
  } = useCheckInNFC(challenge, tapNFC);

  const { checkedIn } = useUserChallengeCheckIns(address, challenge.id);

  const onCheckInButtonClick = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setTapNFC(true);

    // Simulate a delay to ensure the state update is processed
    setTimeout(() => {
      try {
        onCheckInTx();
      } catch (err) {
        console.error(err);
        toast.error('Please try to tap the NFC again');
      } finally {
        setTapNFC(false); // reset state after attempting to check in
      }
    }, 0);
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
