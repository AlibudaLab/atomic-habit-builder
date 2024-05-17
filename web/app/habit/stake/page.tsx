/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import Image from 'next/image';
import { useRef, useState, useEffect, use } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContracts, useCapabilities, useCallsStatus } from 'wagmi/experimental';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';
import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import toast from 'react-hot-toast';

import { useReadErc20Allowance } from '@/hooks/ERC20Hooks';
import { Challenge } from '@/hooks/useUserChallenges';

const img = require('@/imgs/step2.png') as string;
const kangaroo = require('@/imgs/kangaroo.png') as string;

import { formatEther, parseEther } from 'viem';

import { ChallengesDropDown } from './components/dropdown';
import { challenges, EXPECTED_CHAIN } from '@/constants';
import Header from '../components/Header';

import { useRouter } from 'next/navigation';

export default function Join() {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<null | Challenge>(null);

  const handleOnChoose = (challengeArx: string) => {
    const challenge = challenges.find((c) => c.arxAddress === challengeArx) ?? null;
    setSelectedChallenge(challenge);
  };

  const { push } = useRouter();
  const { address: smartWallet } = useAccount();
  const { data: capabilities } = useCapabilities();
  const [currentChainSupportBatchTx, setCurrentChainSupportBatchTx] = useState(false);
  const balance = useBalance({ address: smartWallet, token: testTokenContract.address });
  const testTokenBalance = balance.data ? Number(formatEther(balance.data.value)) : 0;
  const hasEnoughBalance = selectedChallenge && testTokenBalance >= selectedChallenge.stake;
  const { data: allowance } = useReadErc20Allowance({
    address: testTokenContract.address,
    args: [smartWallet as `0x${string}`, trackerContract.address],
  });
  const hasEnoughAllowance =
    selectedChallenge && Number(formatEther(allowance as bigint)) >= selectedChallenge.stake;

  const onSwitchBatchTxMode = () => {
    setCurrentChainSupportBatchTx(!currentChainSupportBatchTx);
  }

  const {
    writeContract: mintWriteContract,
    data: mintDataHash,
    error: mintError,
    isPending: mintPending,
  } = useWriteContract();

  const onMintTestTokenClick = async () => {
    if (!selectedChallenge) return;
    mintWriteContract({
      address: testTokenContract.address as `0x${string}`,
      abi: testTokenContract.abi,
      functionName: 'mint',
      args: [smartWallet as `0x${string}`, parseEther(selectedChallenge.stake.toString())],
    });
  };

  const {
    writeContract: approveWriteContract,
    data: approveDataHash,
    error: approveError,
    isPending: approvePending,
  } = useWriteContract();

  const onApproveTestTokenClick = async () => {
    if (!selectedChallenge) return;
    approveWriteContract({
      address: testTokenContract.address as `0x${string}`,
      abi: testTokenContract.abi,
      functionName: 'approve',
      args: [
        trackerContract.address as `0x${string}`,
        parseEther(selectedChallenge.stake.toString()),
      ],
    });
  };

  const onOnrampClick = async () => {
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
  };

  const {
    writeContract: joinWriteContract,
    data: joinDataHash,
    error: joinError,
    isPending: joinPending,
  } = useWriteContract();

  const {
    writeContracts: joinWriteContracts,
    data: joinIdInBatchTx,
    error: joinErrorInBatchTx,
    isPending: joinPendingInBatchTx,
  } = useWriteContracts();

  const { data: callsStatus } = useCallsStatus({
    id: joinIdInBatchTx as string,
    query: {
      enabled: !!joinIdInBatchTx,
      // Poll every second until the calls are confirmed
      refetchInterval: (data) => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
    },
  });

  const { isLoading: isJoinLoading, isSuccess: isJoinSuccess } = useWaitForTransactionReceipt({
    hash: joinDataHash ?? (callsStatus?.receipts?.[0]?.transactionHash as `0x${string}`),
  });

  const { isLoading: isMintLoading } = useWaitForTransactionReceipt({
    hash: mintDataHash,
  });

  const { isLoading: isApproveLoading } = useWaitForTransactionReceipt({
    hash: approveDataHash,
  });

  const onJoinButtonClick = async () => {
    if (!selectedChallenge) return;

    if (currentChainSupportBatchTx) {
      joinWriteContracts({
        contracts: [
          {
            address: testTokenContract.address as `0x${string}`,
            abi: testTokenContract.abi,
            functionName: 'mint',
            args: [smartWallet, parseEther(selectedChallenge.stake.toString())],
          },
          {
            address: testTokenContract.address as `0x${string}`,
            abi: testTokenContract.abi,
            functionName: 'approve',
            args: [
              trackerContract.address as `0x${string}`,
              parseEther(selectedChallenge.stake.toString()),
            ],
          },
          {
            address: trackerContract.address as `0x${string}`,
            abi: trackerContract.abi,
            functionName: 'join',
            args: [selectedChallenge.arxAddress],
          },
        ],
      });
    } else {
      joinWriteContract({
        address: trackerContract.address as `0x${string}`,
        abi: trackerContract.abi,
        functionName: 'join',
        args: [selectedChallenge.arxAddress as `0x${string}`],
      });
    }
  };

  useEffect(() => {
    if (capabilities) {
      const support = capabilities?.[EXPECTED_CHAIN.id.toString() as unknown as keyof typeof capabilities]
        ?.atomicBatch?.supported;
      setCurrentChainSupportBatchTx(support);
    }
  }, [capabilities]);

  useEffect(() => {
    if (isJoinSuccess) {
      toast.success('Joined! Directing to checkIn!');

      // go to checkin page after 2 secs
      setTimeout(() => {
        push(`/habit/checkin/${selectedChallenge?.arxAddress}`);
      }, 2000);
    }
  }, [isJoinSuccess, selectedChallenge?.arxAddress, push]);

  useEffect(() => {
    if (mintError) {
      toast.error('Error minting test token. Please try again');
    }
    if (approveError) {
      toast.error('Error approving test token. Please try again');
    }
    if (joinError || joinErrorInBatchTx) {
      toast.error('Error joining the challenge. Please try again');
    }
  }, [mintError, approveError, joinError, joinErrorInBatchTx]);

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

        {/**
         * Disable button when challenge hasn't selected or when not enough balance and doesn't support batch tx
         * If support batch tx -> Join with Batch Tx (Mint -> Approve -> Join)
         * If doesn't support batch tx, has enough balance, has enough allowance -> Stake Tx
         * If doesn't support batch tx, has enough balance, not enough allowance -> Approve Tx
         */}
        <button
          type="button"
          className="bg-yellow bg-yellow mt-4 rounded-lg border-solid px-6 py-3 font-bold disabled:cursor-not-allowed disabled:bg-gray-400"
          style={{ width: '250px', height: '45px', color: 'white' }}
          onClick={
            currentChainSupportBatchTx || hasEnoughAllowance
              ? onJoinButtonClick
              : onApproveTestTokenClick
          }
          disabled={
            !selectedChallenge ||
            (!hasEnoughBalance && !currentChainSupportBatchTx) ||
            mintPending ||
            approvePending ||
            joinPending ||
            joinPendingInBatchTx ||
            isJoinLoading ||
            isMintLoading ||
            isApproveLoading
          }
        >
          {/**
           * If support batch tx or has enough allowance -> Display stake
           */}
          {selectedChallenge === null
            ? 'Choose a Challenge'
            : currentChainSupportBatchTx || hasEnoughAllowance
            ? `Stake ${selectedChallenge.stake} ALI`
            : 'Approve'}
        </button>

        {/**
         * Display only when challenge is selected
         * If doesn't support batch tx and doesn't have enough balance -> Mint first
         * If doesn't support batch tx and has enough balance -> Show balance only
         * If support batch tx -> Show balance only
         */}
        <div className="p-4 text-xs">
          {!selectedChallenge || currentChainSupportBatchTx ? (
            <p> </p>
          ) : balance.data && !hasEnoughBalance ? (
            <p>
              {' '}
              🚨 Insufficient Balance: {testTokenBalance.toString()} Alibuda Token.{' '}
              <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                {' '}
                Mint Test Token now{' '}
              </span>{' '}
            </p>
          ) : (
            <p> 💰 Smart Wallet Balance: {testTokenBalance.toString()} Alibuda Token </p>
          )}
        </div>
        <div id="overlay-button">
          {' '}
          <span className="font-bold hover:underline" onClick={onSwitchBatchTxMode}>
            {' '}
            Switch to none BatchTx mode{' '}
          </span>{' '}
        </div>

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
