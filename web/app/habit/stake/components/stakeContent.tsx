/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';

import { EXPECTED_CHAIN } from '@/constants';
import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import useChallenge from '@/hooks/useChallenge';
import useMintERC20 from '@/hooks/transaction/useMintERC20';
import useApproveERC20 from '@/hooks/transaction/useApproveERC20';
import useJoinChallenge from '@/hooks/transaction/useJoinChallenge';
import { useReadErc20Allowance } from '@/hooks/ERC20Hooks';
import { getCheckInDescription } from '@/utils/challenges';
import Header from 'app/habit/components/Header';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import Loading from 'app/habit/components/Loading';

export default function StakeChallenge() {
  const { challengeId } = useParams<{ challengeId: string }>();

  const { challenge, loading } = useChallenge(Number(challengeId));

  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const { address: smartWallet } = useAccount();

  const { data: capabilities } = useCapabilities();
  const currentChainSupportBatchTx =
    capabilities?.[EXPECTED_CHAIN.id.toString() as unknown as keyof typeof capabilities]
      ?.atomicBatch.supported;

  const { data: testTokenBalance } = useBalance({
    address: smartWallet,
    token: testTokenContract.address,
  });

  const hasEnoughBalance =
    challenge &&
    testTokenBalance &&
    Number(testTokenBalance.value.toString()) >= Number(challenge.stake.toString());

  const { data: allowance } = useReadErc20Allowance({
    address: testTokenContract.address,
    args: [smartWallet as `0x${string}`, trackerContract.address],
  });

  const hasEnoughAllowance = allowance
    ? challenge && Number(allowance) >= Number(formatEther(challenge.stake))
    : false;

  const {
    onSubmitTransaction: onMintTx,
    isPreparing: isMintPreparing,
    isLoading: isMintLoading,
  } = useMintERC20(
    testTokenContract.address as `0x${string}`,
    smartWallet as `0x${string}`,
    challenge?.stake ?? BigInt(0) * BigInt(10),
  );

  const onMintTestTokenClick = async () => {
    if (!challenge) return;
    onMintTx();
  };

  const {
    onSubmitTransaction: onApproveTx,
    isPreparing: isApprovePreparing,
    isLoading: isApproveLoading,
  } = useApproveERC20(
    testTokenContract.address as `0x${string}`,
    trackerContract.address,
    challenge?.stake ?? BigInt(0),
  );

  const onApproveTestTokenClick = async () => {
    if (!challenge) return;
    onApproveTx();
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
    onSubmitTransaction: onJoinTx,
    isPreparing: isJoinPreparing,
    isLoading: isJoinLoading,
  } = useJoinChallenge(
    challenge?.id ?? BigInt(0),
    currentChainSupportBatchTx,
    challenge?.stake ?? BigInt(0),
  );

  const onJoinButtonClick = async () => {
    if (!challenge) {
      toast.error('Loading Challenge');
      return;
    }
    onJoinTx();
  };

  return (
    <main className="container mx-auto flex flex-col items-center px-4 pt-16 text-center">
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
              isMintPreparing ||
              isApprovePreparing ||
              isJoinPreparing ||
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
