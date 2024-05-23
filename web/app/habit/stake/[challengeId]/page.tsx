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

import { formatEther, parseEther } from 'viem';

import { EXPECTED_CHAIN } from '@/constants';

import { useParams, useRouter } from 'next/navigation';
import useChallenge from '@/hooks/useChallenge';
import Header from 'app/habit/components/Header';
import { getCheckInDescription } from '@/utils/challenges';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';

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
  const balance = useBalance({ address: smartWallet, token: testTokenContract.address });
  const testTokenBalance = balance.data ? Number(formatEther(balance.data.value)) : 0;
  const hasEnoughBalance = challenge && testTokenBalance >= challenge.stake;
  const { data: allowance } = useReadErc20Allowance({
    address: testTokenContract.address,
    args: [smartWallet as `0x${string}`, trackerContract.address],
  });

  const hasEnoughAllowance = allowance
    ? challenge && Number(formatEther(allowance)) >= challenge.stake
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
      args: [smartWallet as `0x${string}`, parseEther(challenge.stake.toString()) * BigInt(10)],
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
      args: [trackerContract.address, parseEther(challenge.stake.toString())],
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
            args: [trackerContract.address, parseEther(challenge.stake.toString())],
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
        <p className="text-primary text-center text-lg font-bold"> Stake and Commit to it </p>

        {challenge && (
          <>
           <ChallengeBoxFilled challenge={challenge} />

            {/* goal description */}
            <div className="justify-start p-6 pb-2 text-start w-full">
              <div className="text-dark pb-2 text-xl font-bold"> Goal </div>
              <div className="text-dark text-sm"> {challenge.description} </div>
            </div>

            {/* checkIn description */}
            <div className="justify-start p-6 pb-2 text-start w-full">
              <div className="text-dark pb-2 text-xl font-bold"> Check In </div>
              <div className="text-dark text-sm"> {getCheckInDescription(challenge.type)} </div>
            </div>

            {/* checkIn description */}
            <div className="justify-start p-6 pb-2 text-start w-full">
              <div className="text-dark pb-2 text-xl font-bold"> Stake Amount </div>
              <div className="text-dark text-sm"> {`${formatEther(challenge.stake)} ALI`} </div>
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
            className="bg-primary bg-primary mt-4 rounded-lg border-solid px-6 py-3 font-bold disabled:cursor-not-allowed disabled:bg-gray-400"
            style={{ width: '250px', height: '45px', color: 'white' }}
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
            {hasEnoughAllowance || currentChainSupportBatchTx
              ? `Join`
              : 'Approve'}
          </button>
        )}

        {/**
         * Display only when challenge is selected
         * If doesn't have enough balance -> Mint first
         * If has enough balance -> Show balance
         */}
        <div className="p-4 text-xs">
          {!challenge || loading ? (
            <p> Loading Challenge </p>
          ) : balance.data && !hasEnoughBalance ? (
            <p>
              {' '}
              🚨 Insufficient Balance: {testTokenBalance?.toString() || 0} Test Token.{' '}
              <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                {' '}
                Mint Test Token now{' '}
              </span>{' '}
            </p>
          ) : (
            <p> 💰 Smart Wallet Balance: {testTokenBalance?.toString() || 0} Test Token </p>
          )}
        </div>
      </div>
    </main>
  );
}
