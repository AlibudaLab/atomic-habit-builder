/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { formatUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { Input } from '@nextui-org/input';
import moment, { now } from 'moment';

import { usdcAddr } from '@/constants';
import useMintERC20 from '@/hooks/transaction/useMintERC20';
import useJoinChallenge from '@/hooks/transaction/useJoinChallenge';
import { getCheckInDescription } from '@/utils/challenges';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import Loading from 'app/habit/components/Loading';
import JoinedPopup from './JoinedPopup';
import InsufficientBalancePopup from './InsufficientBalancePopup';
import DepositPopup from './DepositPopup';
import { Button } from '@nextui-org/button';
import { Environment, getCurrentEnvironment } from '@/store/environment';
import { useAllChallenges } from '@/providers/ChallengesProvider';
import { Checkbox } from '@nextui-org/react';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { ConnectButton } from '@/components/Connect/ConnectButton';
import { logEvent } from '@/utils/gtag';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import useChallenge from '@/hooks/useChallenge';
import { useUserStatus } from '@/hooks/useUserStatus';

const isTestnet = getCurrentEnvironment() === Environment.testnet;

export default function StakeChallenge() {
  const { push } = useRouter();

  const { challengeId } = useParams<{ challengeId: string }>();
  const { address } = useAccount();

  const searchParams = useSearchParams();
  const attachedCode = searchParams.get('code') ?? '';

  const [inputAccessCode, setInputAccessCode] = useState<string>(attachedCode);

  const [confirmBoxChecked, setConfirmBoxChecked] = useState(false);

  const { challenge, loading: loadingChallenge } = useChallenge(Number(challengeId));

  const { joined } = useUserStatus(Number(challengeId));

  const { refetch: refetchAllChallenges } = useAllChallenges();
  const { refetch: refetchUserChallenges } = useUserChallenges();

  const { address: smartWallet } = useAccount();

  const hasAccess = useMemo(
    () =>
      challenge?.public === true ||
      challenge?.creator === address ||
      challenge?.accessCode === inputAccessCode ||
      joined,
    [
      challenge?.public,
      challenge?.accessCode,
      inputAccessCode,
      joined,
      address,
      challenge?.creator,
    ],
  );

  const { data: tokenBalance } = useBalance({
    address: smartWallet,
    token: usdcAddr,
    query: {
      enabled: !!smartWallet && !!challenge,
      refetchInterval: (data: any) =>
        challenge &&
        data.value &&
        Number(data.value.toString()) > Number(challenge.stake.toString())
          ? 10000
          : 2000,
    },
  });

  const hasEnoughBalance =
    challenge &&
    tokenBalance &&
    Number(tokenBalance.value.toString()) >= Number(challenge.stake.toString());

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);
  const [isInsufficientBalancePopupOpen, setIsInsufficientBalancePopupOpen] = useState(false);
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);

  const handleOpenCheckinPopup = useCallback(() => setIsCheckinPopupOpen(true), []);
  const handleCloseCheckinPopup = useCallback(() => setIsCheckinPopupOpen(false), []);
  const handleOpenInsufficientBalancePopup = useCallback(
    () => setIsInsufficientBalancePopupOpen(true),
    [],
  );
  const handleCloseInsufficientBalancePopup = useCallback(
    () => setIsInsufficientBalancePopupOpen(false),
    [],
  );
  const handleOpenDepositPopup = useCallback(() => {
    logEvent({ action: 'deposit', category: 'account', label: 'deposit', value: 1 });
    setIsDepositPopupOpen(true);
  }, []);
  const handleCloseDepositPopup = useCallback(() => setIsDepositPopupOpen(false), []);
  const handleCheckInPageClick = useCallback(() => {
    // Logic to navigate to the check-in page
    push(`/habit/checkin/${challengeId}`);
  }, [challengeId, push]);

  const {
    onSubmitTransaction: onMintTx,
    isPreparing: isMintPreparing,
    isLoading: isMintLoading,
  } = useMintERC20(
    usdcAddr,
    smartWallet as `0x${string}`,
    500_000000n, // mint 500 USDC
  );

  const onMintTestTokenClick = async () => {
    if (!challenge) return;
    onMintTx();
  };

  const {
    onSubmitTransaction: onJoinTx,
    isPreparing: isJoinPreparing,
    isLoading: isJoinLoading,
  } = useJoinChallenge(address, BigInt(challenge?.id ?? 0), challenge?.stake ?? BigInt(0), () => {
    Promise.all([refetchUserChallenges(), refetchAllChallenges()]).catch((e) =>
      console.log('refetch error', e),
    );

    handleOpenCheckinPopup(); // trigger pop up window
  });

  const onJoinButtonClick = () => {
    if (!challenge) {
      toast.error('Loading Challenge');
      return;
    }
    if (hasEnoughBalance) {
      onJoinTx();
      return;
    }
    handleOpenInsufficientBalancePopup();
  };

  return (
    <main className="flex h-screen flex-col items-center px-4 pb-12 text-center">
      <div className="flex max-w-96 flex-col items-center justify-center">
        <SubTitle text="Stake and Commit to It!" />

        {challenge && (
          <>
            <div className="my-4 w-full">
              <ChallengeBoxFilled challenge={challenge} fullWidth />
            </div>

            {hasAccess && (
              <>
                {/* goal description */}
                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="text-xl font-bold text-dark"> Goal </div>
                  <div className="text-sm text-primary"> {challenge.description} </div>
                </div>

                {/* checkIn description */}
                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="text-xl font-bold text-dark"> Check In </div>
                  <div className="text-sm text-primary">
                    {' '}
                    {getCheckInDescription(challenge.type)}{' '}
                  </div>
                </div>

                <div className="w-full justify-start p-6 py-2 text-start">
                  <div className="text-xl font-bold text-dark"> Stake Amount </div>
                  <div className="flex text-sm text-primary">
                    {' '}
                    {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
                  </div>
                </div>

                <div className="m-4 text-center font-londrina text-base">
                  ⏰ Challenge {challenge.endTimestamp > now() / 1000 ? 'settles' : 'settled'}{' '}
                  {moment.unix(challenge.endTimestamp).fromNow()}
                </div>
              </>
            )}
          </>
        )}

        {/* if no access, show text + button for access code */}
        {challenge && !hasAccess && (
          <div className="w-full justify-center p-6 py-2 text-center">
            <div className="pb-2 text-xl font-bold text-dark"> Private Challenge </div>
            <div className="pt-4 text-sm text-primary">
              This is a private challenge! Please enter the access code to join.
            </div>
            <Input
              type="text"
              placeholder="Access Code"
              className="my-4 w-full py-4 text-center"
              description="Example Code: 130M8L"
              value={inputAccessCode}
              onChange={(e) => setInputAccessCode(e.target.value)}
            />
          </div>
        )}

        {challenge && !address ? (
          <ConnectButton className="mt-4 w-3/4" cta="Join This Challenge" primary />
        ) : (
          hasAccess &&
          !joined &&
          challenge && (
            <div>
              <div className="mx-8 mt-4 flex justify-center gap-2">
                <Checkbox
                  className="font-londrina text-xs text-gray-600"
                  size="sm"
                  isSelected={confirmBoxChecked}
                  onValueChange={setConfirmBoxChecked}
                />
                <span className="text-start font-londrina text-sm text-gray-500">
                  {`Fair warning: Missing any of the ${
                    challenge.minimumCheckIns
                  } check-ins means my ${formatUnits(
                    challenge.stake,
                    6,
                  )} USDC joins the prize pool for others. I'm in!`}
                </span>
              </div>
              <Button
                color="primary"
                type="button"
                className="mt-4 min-h-12 w-3/4 max-w-56 px-6 py-3 font-bold"
                onClick={onJoinButtonClick}
                isDisabled={
                  isJoinPreparing ||
                  isMintPreparing ||
                  isJoinLoading ||
                  isMintLoading ||
                  !confirmBoxChecked
                }
                isLoading={isJoinPreparing || isMintPreparing || isJoinLoading || isMintLoading}
              >
                Join This Challenge
              </Button>
            </div>
          )
        )}

        {joined && (
          <Button
            type="button"
            color="default"
            className="mt-14 min-h-12 w-3/4 max-w-56"
            onClick={handleCheckInPageClick}
            aria-description="You already joined the challenge"
          >
            Start CheckIn
          </Button>
        )}

        {isCheckinPopupOpen && challenge && (
          <JoinedPopup
            challenge={challenge}
            onClose={handleCloseCheckinPopup}
            onCheckInPageClick={handleCheckInPageClick}
          />
        )}
        {isInsufficientBalancePopupOpen && !hasEnoughBalance && (
          <InsufficientBalancePopup
            onClose={handleCloseInsufficientBalancePopup}
            onDepositClick={handleOpenDepositPopup}
          />
        )}

        {isDepositPopupOpen && <DepositPopup onClose={handleCloseDepositPopup} />}

        {loadingChallenge ? (
          <Loading />
        ) : (
          challenge === null && (
            <div className="p-4 text-sm">
              <p>Challenge not found</p>

              <Button color="default" className="mt-4" onClick={() => push('/')}>
                Back
              </Button>
            </div>
          )
        )}

        {/**
         * If doesn't have enough balance -> Mint first
         * If has enough balance -> Show balance
         */}
        {hasAccess && address && !loadingChallenge && (
          <div className="p-4 text-xs">
            {tokenBalance && !hasEnoughBalance ? (
              <p>
                {' '}
                🚨 Insufficient Balance: {tokenBalance
                  ? formatUnits(tokenBalance.value, 6)
                  : 0}{' '}
                USDC.{' '}
                {isTestnet && (
                  <span className="font-bold hover:underline" onClick={onMintTestTokenClick}>
                    {' '}
                    Mint Test Token now{' '}
                  </span>
                )}
              </p>
            ) : (
              <p>
                {' '}
                💰 Smart Wallet Balance: {tokenBalance
                  ? formatUnits(tokenBalance.value, 6)
                  : 0}{' '}
                USDC{' '}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
