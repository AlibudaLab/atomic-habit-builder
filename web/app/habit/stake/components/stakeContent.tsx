/* eslint-disable react-perf/jsx-no-new-function-as-prop */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { useCapabilities } from 'wagmi/experimental';

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
import CheckInPopup from './CheckinPopup';
import InsufficientBalancePopup from './InsufficientBalancePopup';
import DepositPopup from './DepositPopup';

export default function StakeChallenge() {
  const { push } = useRouter();

  const { challengeId } = useParams<{ challengeId: string }>();

  const { challenge, loading } = useChallenge(Number(challengeId));

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

  const hasEnoughAllowance = allowance ? challenge && allowance >= challenge.stake : false;

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);
  const [isInsufficientBalancePopupOpen, setIsInsufficientBalancePopupOpen] = useState(false);
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);

  const handleOpenCheckinPopup = () => setIsCheckinPopupOpen(true);
  const handleCloseCheckinPopup = () => setIsCheckinPopupOpen(false);
  const handleOpenInsufficientBalancePopup = () => setIsInsufficientBalancePopupOpen(true);
  const handleCloseInsufficientBalancePopup = () => setIsInsufficientBalancePopupOpen(false);
  const handleOpenDepositPopup = () => setIsDepositPopupOpen(true);
  const handleCloseDepositPopup = () => setIsDepositPopupOpen(false);
  const handleCheckInPageClick = () => {
    // Logic to navigate to the check-in page
    setTimeout(() => {
      push(`/habit/checkin/${challengeId}`);
    }, 2000);
  };

  const {
    onSubmitTransaction: onMintTx,
    isPreparing: isMintPreparing,
    isLoading: isMintLoading,
  } = useMintERC20(
    testTokenContract.address as `0x${string}`,
    smartWallet as `0x${string}`,
    500_000000n, // mint 500 USDC
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

  const {
    onSubmitTransaction: onJoinTx,
    isPreparing: isJoinPreparing,
    isLoading: isJoinLoading,
  } = useJoinChallenge(
    challenge?.id ?? BigInt(0),
    currentChainSupportBatchTx,
    challenge?.stake ?? BigInt(0),
    () => {
      handleOpenCheckinPopup(); // trigger pop up window
    },
  );

  const onJoinButtonClick = async () => {
    if (!challenge) {
      toast.error('Loading Challenge');
      return;
    }
    if (hasEnoughBalance) {
      onJoinTx();
    }
    handleOpenInsufficientBalancePopup();
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
              <div className="text-sm text-primary">
                {' '}
                {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
              </div>
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

        {isCheckinPopupOpen && hasEnoughBalance && (
          <CheckInPopup onClose={handleCloseCheckinPopup} onCheckInPageClick={handleCheckInPageClick} />
        )}
        {isInsufficientBalancePopupOpen && !hasEnoughBalance && (
          <InsufficientBalancePopup
            onClose={handleCloseInsufficientBalancePopup}
            onDepositClick={handleOpenDepositPopup}
          />
        )}

        {isDepositPopupOpen && <DepositPopup onClose={handleCloseDepositPopup} />}

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
              🚨 Insufficient Balance:{' '}
              {testTokenBalance ? formatUnits(testTokenBalance.value, 6) : 0} USDC.{' '}
              <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                {' '}
                Mint Test Token now{' '}
              </span>{' '}
            </p>
          ) : (
            <p>
              {' '}
              💰 Smart Wallet Balance:{' '}
              {testTokenBalance ? formatUnits(testTokenBalance.value, 6) : 0} USDC{' '}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
