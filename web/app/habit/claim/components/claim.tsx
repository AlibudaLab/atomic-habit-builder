'use client';

import { useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import * as trackerContract from '@/contracts/tracker';
import toast from 'react-hot-toast';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import useAllChallenges from '@/hooks/useAllChallenges';

import GenerateByName from '@/components/Nouns/GenerateByName';

export default function Claim() {
  const { challengeId } = useParams<{ challengeId: string }>();

  const { challenges } = useAllChallenges();

  const challenge = challenges.find((c) => c.id.toString() === challengeId);

  const { push } = useRouter();

  const {
    writeContract,
    data: dataHash,
    error: claimError,
    isPending: claimPending,
  } = useWriteContract();

  const { isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onClaimClick = async () => {
    writeContract({
      address: trackerContract.address,
      abi: trackerContract.abi,
      functionName: 'withdraw',
      args: [],
    });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success('Successfully Claimed!');
    }
    if (claimError) {
      toast.error(claimError.name);
    }
  }, [isSuccess, claimError]);

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
              className="bg-primary mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
              onClick={() => {
                push('/');
              }}
            >
              Start a new Challenge
            </button>
          ) : (
            <button
              type="button"
              className="bg-primary mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
              onClick={onClaimClick}
            >
              Claim Rewards
            </button>
          )}

          <div className="p-4 text-xs">Get back {challenge.stake} ETH.</div>

          <GenerateByName properties={{ name: 'You Success', alt: 'Step 4 Image' }} />
        </>
      ) : (
        <div>Invalid Challenge Id</div>
      )}
    </div>
  );
}
