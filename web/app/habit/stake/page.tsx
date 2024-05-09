/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';
import { parseEther } from 'ethers/lib/utils';
import trackerContract from '@/contracts/tracker.json';
import toast from 'react-hot-toast';

import { Challenge } from '@/hooks/useUserChallenges';

const img = require('@/imgs/step2.png') as string;
const kangaroo = require('@/imgs/kangaroo.png') as string;

import { formatEther } from 'viem';

import { ChallengesDropDown } from './components/dropdown';
import { challenges } from '@/constants';
import Header from '../components/Header';

export default function Join() {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const [selectedChallenge, setSelectedChallenge] = useState<null | Challenge>(null);

  const handleOnChoose = (challengeArx: string) => {
    const challenge = challenges.find((c) => c.arxAddress === challengeArx) ?? null;
    setSelectedChallenge(challenge);
  };

  const { address: smartWallet } = useAccount();
  const balance = useBalance({ address: smartWallet });
  const ethBalance = balance.data ? Number(formatEther(balance.data.value)) : 0;
  const hasEnoughBalance = selectedChallenge && ethBalance > selectedChallenge.stake;

  const handleOnClickOnramp = async () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        console.log('is visible');
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        console.log('is not visible');
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = crypto.randomBytes(32).toString('hex');
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: '#overlay-button',
        lang: GateFiLangEnum.en_US,
        isSandbox: true,
        successUrl: window.location.href,
        walletAddress: smartWallet,
        externalId: randomString,
        defaultFiat: {
          currency: 'USD',
          amount: '20',
        },
        defaultCrypto: {
          currency: 'ETH',
        },
      });
    }
    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
    // Get data from web/app/habit/mock/on-ramp.json
    const mockData = require('../mock/on-ramp.json');
    mockData.data.destinationWallet = smartWallet;
    // Call the bridge API with payload
    await fetch('/api/bridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData),
    });
  };

  const {
    writeContract,
    data: dataHash,
    error: joinError,
    isPending: joinPending,
  } = useWriteContract();

  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: dataHash,
  });

  const onJoinButtonClick = async () => {
    if (!selectedChallenge) return;
    writeContract({
      address: trackerContract.address as `0x${string}`,
      abi: trackerContract.abi,
      functionName: 'join',
      args: [selectedChallenge.arxAddress],
      value: parseEther(selectedChallenge.stake.toString()).toBigInt(),
    });
  };

  // if (!smartWallet) {
  //   redirect('/');
  // }

  useEffect(() => {
    if (isSuccess) {
      toast.success('Joined!! Directing to next step!');
      setTimeout(() => {
        // setSteps(3);
        // todo: go to checkin page, or dashboard
      }, 2000);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (joinError) {
      toast.error('Error joining the challenge. Please try again');
    }
  }, [joinError]);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="flex flex-col items-center justify-center">
        {/* Img and Description */}
        <div className="flex items-center gap-6">
          <Image
            src={img}
            width="50"
            alt="Step 2 Image"
            className="mb-3 rounded-full object-cover"
          />
          <p className="mr-auto text-lg font-bold">Stake and Join a challenge</p>
        </div>

        {/* drop down here */}
        <div className="pt-4">
          <ChallengesDropDown
            selectedChallenge={selectedChallenge}
            setSelectedChallenge={setSelectedChallenge}
            onChoose={handleOnChoose}
          />
        </div>

        <button
          type="button"
          className="bg-yellow bg-yellow mt-4 rounded-lg border-solid px-6 py-3 font-bold disabled:cursor-not-allowed disabled:bg-gray-400"
          style={{ width: '250px', height: '45px', color: 'white' }}
          onClick={onJoinButtonClick}
          disabled={!hasEnoughBalance || joinPending || isLoading}
        >
          {selectedChallenge ? `Stake ${selectedChallenge.stake} ETH` : 'Stake'}
        </button>

        <div className="p-4 text-xs">
          {balance.data && hasEnoughBalance ? (
            <p> 💰 Smart Wallet Balance: {ethBalance.toString()} ETH </p>
          ) : (
            <p>
              {' '}
              🚨 Insufficient Balance: {ethBalance.toString()} ETH.{' '}
              <span className="font-bold hover:underline" onClick={handleOnClickOnramp}>
                {' '}
                Onramp now{' '}
              </span>{' '}
            </p>
          )}
        </div>
        <div id="overlay-button"> </div>

        {/* warn message */}
        <div className="text-md px-10 pt-8">
          if you fail to maintain the habit, 50% of the stake will be donated to designated public
          goods orgs, and 50% be distributed to other habit building winners.
        </div>

        <div className="w-full justify-start px-6">
          <Image src={kangaroo} width="350" alt="Kangaroo" className="mb object-cover" />
        </div>
      </div>
    </main>
  );
}
