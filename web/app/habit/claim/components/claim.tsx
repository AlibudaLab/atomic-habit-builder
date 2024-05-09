'use client';

import { Challenge } from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { challenges } from '@/constants';
import { useRouter } from 'next/navigation'

const img = require('@/imgs/success.png') as string;

export default function Claim() {
  const { challengeId } = useParams<{ challengeId: string }>();

  const challenge = challenges.find((c) => c.arxAddress === challengeId);

  const { push } = useRouter()

  const {
    writeContract,
    data: dataHash,
    error: joinError,
    isPending: joinPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onClaimClick = async () => {
    writeContract({
      address: trackerContract.address as `0x${string}`,
      abi: trackerContract.abi,
      functionName: 'withdraw',
      args: [],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successfully Claimed!');
    }
  }, [isSuccess]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      {challenge ? (
        <>
          <div className="col-span-3 flex w-full items-center justify-center">
            <p className="p-8 pt-2 text-center text-lg font-bold">
              {' '}
              You have successfully finish the challenge!{' '}
            </p>
          </div>

          {isSuccess ? (
            <button
              type="button"
              className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
              onClick={() => {
                push('/habit/')
              }}
            >
              Start a new Challenge
            </button>
          ) : (
            <button
              type="button"
              className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
              onClick={onClaimClick}
            >
              Claim Rewards
            </button>
          )}

          <div className="p-4 text-xs">Get back {challenge.stake} ETH.</div>

          <Image
            src={img}
            width="440"
            height="440"
            alt="Step 4 Image"
            className="mb-3 object-cover"
          />
        </>
      ) : (
        <div>Invalid Challenge Id</div>
      )}
    </div>
  );
}
