/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useRef, useState, useEffect } from 'react';
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContracts, useCapabilities, useCallsStatus } from 'wagmi/experimental';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';
import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import toast from 'react-hot-toast';

import { useReadErc20Allowance } from '@/hooks/ERC20Hooks';

import { formatEther } from 'viem';

import { EXPECTED_CHAIN } from '@/constants';

import { useParams, useRouter } from 'next/navigation';
import useChallenge from '@/hooks/useChallenge';
import Header from 'app/habit/components/Header';
import { getCheckInDescription } from '@/utils/challenges';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import Loading from 'app/habit/components/Loading';

export default function StakeChallenge() {
  const { challengeId } = useParams<{ challengeId: string }>();

  const { challenge, loading } = useChallenge(Number(challengeId));

  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const { push } = useRouter();
  const { address: smartWallet } = useAccount();
  const { data: capabilities } = useCapabilities();

  const currentChainSupportBatchTx =
    capabilities?.[EXPECTED_CHAIN.id.toString() as unknown as keyof typeof capabilities]
      ?.atomicBatch.supported;
  const { data: testTokenBalance } = useBalance({
    address: smartWallet,
    token: testTokenContract.address,
  });

  console.log('testTokenBalance', testTokenBalance);

  const hasEnoughBalance =
    challenge &&
    testTokenBalance &&
    Number(testTokenBalance.value.toString()) >= Number(challenge.stake.toString());

  console.log('hasEnoughBalance', hasEnoughBalance);

  const { data: allowance } = useReadErc20Allowance({
    address: testTokenContract.address,
    args: [smartWallet as `0x${string}`, trackerContract.address],
  });

  const hasEnoughAllowance = allowance
    ? challenge && Number(allowance) >= Number(formatEther(challenge.stake))
    : false;

  const {
    writeContract: mintWriteContract,
    data: mintDataHash,
    error: mintError,
    isPending: mintPending,
  } = useWriteContract();

  const onMintTestTokenClick = async () => {
    if (!challenge) return;
    mintWriteContract({
      address: testTokenContract.address as `0x${string}`,
      abi: testTokenContract.abi,
      functionName: 'mint',
      args: [smartWallet as `0x${string}`, challenge.stake * BigInt(10)],
    });
  };

  const {
    writeContract: approveWriteContract,
    data: approveDataHash,
    error: approveError,
    isPending: approvePending,
  } = useWriteContract();

  const onApproveTestTokenClick = async () => {
    if (!challenge) return;
    approveWriteContract({
      address: testTokenContract.address as `0x${string}`,
      abi: testTokenContract.abi,
      functionName: 'approve',
      args: [trackerContract.address, challenge.stake],
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
      refetchInterval: (data: any) => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
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
    if (!challenge) {
      toast.error('Loading Challenge');
      return;
    }
    if (currentChainSupportBatchTx) {
      joinWriteContracts({
        contracts: [
          {
            address: testTokenContract.address as `0x${string}`,
            abi: testTokenContract.abi,
            functionName: 'approve',
            args: [trackerContract.address, challenge.stake],
          },
          {
            address: trackerContract.address,
            abi: trackerContract.abi,
            functionName: 'join',
            args: [challenge.id],
          },
        ],
      });
    } else {
      joinWriteContract({
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'join',
        args: [challenge.id],
      });
    }
  };

  useEffect(() => {
    if (isJoinSuccess) {
      toast.success('Joined! Directing to checkIn!');

      // go to checkin page after 2 secs
      setTimeout(() => {
        push(`/habit/checkin/${challenge?.id}`);
      }, 2000);
    }
  }, [isJoinSuccess, challenge?.id, push]);

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
    <main className="container mx-auto flex flex-col items-center px-8 pt-16 text-center">
      <Header />

      <div className="flex max-w-96 flex-col items-center justify-center">
        <p className="pb-4 text-center font-londrina text-xl font-bold">
          {' '}
          Stake and Commit to It!{' '}
        </p>

        {challenge && (
          <>
            <ChallengeBoxFilled challenge={challenge} />

            {/* goal description */}
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
          </>
        )}

        {/**
         * Disable button when challenge hasn't selected or when not enough balance
         * If support batch tx -> Join with Batch Tx (Approve -> Join)
         * If doesn't support batch tx, has enough balance, has enough allowance -> Stake Tx
         * If doesn't support batch tx, has enough balance, not enough allowance -> Approve Tx
         */}
        {challenge && (
          <button
            type="button"
            className="wrapped mt-14 rounded-lg border-solid px-6 py-3 font-bold text-primary disabled:opacity-50"
            onClick={
              currentChainSupportBatchTx || hasEnoughAllowance
                ? onJoinButtonClick
                : onApproveTestTokenClick
            }
            disabled={
              !challenge ||
              !hasEnoughBalance ||
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
             * Display only when challenge is selected
             * If doesn't have enough balance -> Display Approve
             * If has enough allowance -> Display Stake
             */}
            {hasEnoughAllowance || currentChainSupportBatchTx ? `Join This Challenge` : 'Approve'}
          </button>
        )}

        {/**
         * Display only when challenge is selected
         * If doesn't have enough balance -> Mint first
         * If has enough balance -> Show balance
         */}
        <div className="p-4 text-xs">
          {!challenge || loading ? (
            <Loading />
          ) : testTokenBalance && !hasEnoughBalance ? (
            <p>
              {' '}
              🚨 Insufficient Balance: {testTokenBalance
                ? formatEther(testTokenBalance.value)
                : 0}{' '}
              ALI.{' '}
              <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                {' '}
                Mint Test Token now{' '}
              </span>{' '}
            </p>
          ) : (
            <p>
              {' '}
              💰 Smart Wallet Balance: {testTokenBalance
                ? formatEther(testTokenBalance.value)
                : 0}{' '}
              ALI.{' '}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
