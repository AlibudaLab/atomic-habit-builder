'use client';

import Image from 'next/image';
import { SetStateAction, useEffect } from 'react';
import { useAccount, useConnect, useWaitForTransactionReceipt } from 'wagmi';
import { arxSignMessage, getCheckinMessage, getEncodedCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';
import { useWriteContract } from 'wagmi';
import trackerContract from '@/contracts/tracker.json';
import { Challenge } from '@/hooks/useUserChallenges';
import { ActivityTypes, VerificationType } from '@/constants';
import moment from 'moment';

const img = require('../../../src/imgs/step3.png') as string;

const mental = require('../../../src/imgs/mental.png') as string;
const physical = require('../../../src/imgs/physical.png') as string;

export default function Step3CheckIn({
  setSteps,
  selectedChallenge,
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  selectedChallenge: Challenge;
}) {
  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  console.log('this challenge', selectedChallenge)

  // TODO: fetch actually done
  const achieved = 5;

  const { data: checkInContractRequest } = useSimulateContract({
    address: trackerContract.address as `0x${string}`,
    abi: trackerContract.abi,
    functionName: 'checkIn',
    args: [],
  });

  const {
    writeContract,
    data: dataHash,
    error: checkInError,
    isPending: checkInPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onClickStrava = async () => {};

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
      txPendingToastId = toast.loading('Check in successful!! 🥳🥳🥳 Sending transaction');

      writeContract({
        address: trackerContract.address as `0x${string}`,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: [
          selectedChallenge.arxAddress,
          getEncodedCheckinMessage(address, timestamp),
          signature.raw.v,
          '0x' + signature.raw.r,
          '0x' + signature.raw.s,
        ],
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
    if (checkInError) {
      toast.error('Error checking in.');
    }
  }, [checkInError]);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="flex items-center gap-6">
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
      <div className="py-2">
        <p className="px-2 font-bold">
          {selectedChallenge.type === ActivityTypes.Mental ? 'Mental' : 'Physical'} Health Habit
          Building{' '}
        </p>
        <p className="px-2 text-sm"> Duration: {selectedChallenge.duration} </p>
        <p className="px-2 text-sm"> Challenge: {selectedChallenge.name} </p>
      </div>

      {selectedChallenge.verificationType === VerificationType.NFC && selectedChallenge.mapKey && (
        <>
          <iframe
            src={selectedChallenge.mapKey}
            title="target location"
            width="400"
            height="300"
            // allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          >
            {' '}
            cool
          </iframe>
          <div className="p-2 text-center text-xs">Scan the NFC at the pinged spot!</div>
        </>
      )}

      {selectedChallenge.verificationType === VerificationType.NFC ? (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onCheckInButtonClick}
          disabled={checkInPending || isLoading}
        >
          {' '}
          {isLoading ? 'Sending tx' : 'Tap Here and Tap NFC'}{' '}
        </button>
      ) : (
        <button
          type="button"
          className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
          onClick={onClickStrava}
        >
          Connect Strava
        </button>
      )}

        {/* put 10 circles indicating target number of achievements */}
        <div className='flex flex-wrap py-6 px-16 gap-4'> 
        {Array.from({ length: selectedChallenge.targetNum }).map((_, idx) => {
          const done = idx < achieved;
          const iconIdx = Number(selectedChallenge.arxAddress) % 20 + idx
          const icon = require(`../../../src/imgs/hats/${iconIdx + 1}.png`) as string;
          return (
            done 
            ? (<div style={{ borderColor: '#EDB830', paddingTop: '4px' }}  key="{idx}" className="w-12 h-12 text-center rounded-full justify-center border border-solid" > <Image src={icon} alt="checkin" /> </div>)
            : (<div style={{ borderColor: 'grey', paddingTop: '10px' }} key="{idx}" className="w-12 h-12 text-center rounded-full justify-center border border-solid " > {idx + 1} </div>))
        })}
        </div>
      
      <div> {achieved} / {selectedChallenge.targetNum} </div>

      { selectedChallenge.verificationType === VerificationType.NFC ? <button
        type="button"
        className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
        onClick={onCheckInButtonClick}
        disabled={joinPending || isLoading}
      >
        {' '}
        {isLoading ? 'Sending tx' : 'Tap Here and Tap NFC'}{' '}
      </button> : <button
        type="button"
        className="mt-4 rounded-lg bg-yellow-500 px-6 py-4 font-bold text-white hover:bg-yellow-600"
        onClick={onClickStrava}
      >
        Connect Strava
      </button>}
    </div>
  );
}
