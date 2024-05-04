'use client';

import Image from 'next/image';
import { SetStateAction, useEffect } from 'react';
import { useAccount, useConnect, useWaitForTransactionReceipt } from 'wagmi';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';
import { useSimulateContract, useWriteContract } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import { ActivityTypes, TESTING_CHALLENGE_ADDRESS } from '@/constants';
import { parseEther } from 'viem';
import { Challenge } from '@/hooks/useUserChallenges';

const img = require('../../../src/imgs/step3.png') as string;

const mental = require('../../../src/imgs/mental.png') as string
const physical = require('../../../src/imgs/physical.png') as string

export default function Step3CheckIn({
  setSteps,
  selectedChallenge,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  selectedChallenge: Challenge
}) {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  console.log('this challenge', selectedChallenge)

  const { data: checkInContractRequest } = useSimulateContract({
    address: trackerContract.address as `0x${string}`,
    abi: trackerContract.abi,
    functionName: 'checkIn',
    args: [],
  });

  const {
    writeContract,
    data: dataHash,
    error: joinError,
    isPending: joinPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onCheckInButtonClick = async () => {
    let nfcPendingToastId = null;
    let txPendingToastId = null;
    try {
      if (!address) {
        toast.error('Please connect your wallet first');
        return;
      }

      nfcPendingToastId = toast.loading('Sensing NFC...');
      const checkInMessage = getCheckinMessage(address);
      const arxSignature = await arxSignMessage(checkInMessage);
      toast.dismiss(nfcPendingToastId);
      txPendingToastId = toast.loading('Check in successful!! 🥳🥳🥳 Sending transaction');
      writeContract({
        address: trackerContract.address as `0x${string}`,
        abi: trackerContract.abi,
        functionName: 'join',
        args: [TESTING_CHALLENGE_ADDRESS],
        value: parseEther('0.001'), // joining stake fee 0.001 ether
      });
    } catch (err) {
      console.error(err);
      toast.error('Please try to tap the NFC again');
    } finally {
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
      toast.success('Recorded on smart contract!! 🥳🥳🥳');
    }
  }, [isSuccess]);

  useEffect(() => {
    if (joinError) {
      toast.error('Error in joining the challenge');
    }
  }, [joinError]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className='flex items-center gap-6'>
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
      <div className='py-2'>
        <p className='font-bold px-2'>{selectedChallenge.type === ActivityTypes.Mental ? 'Mental' : 'Physical'} Health Habit Building </p>
        <p className='px-2 text-sm'> Duration: {selectedChallenge.duration} </p>
        <p className='px-2 text-sm'> Challenge: {selectedChallenge.name} </p>
      </div>

      {selectedChallenge.mapKey && <iframe 
        src={selectedChallenge.mapKey}
        title='target location'
        width="420" 
        height="300" 
        // allowFullScreen="" 
        loading="lazy" 
        referrerPolicy="no-referrer-when-downgrade"> cool </iframe>}

      <div className="text-xs p-2 text-center">Scan the NFC at the pinged spot!</div>

      <button
        type="button"
        className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
        onClick={onCheckInButtonClick}
        disabled={joinPending || isLoading}
      >
        {' '}
        {isLoading ? 'Sending tx' : 'Tap Here and Tap NFC'}{' '}
      </button>
    </div>
  );
}
