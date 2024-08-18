'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useChallenge from '@/hooks/useChallenge';
import useWithdraw from '@/hooks/transaction/useWithdraw';
import ClaimedPopup from './ClaimedPopup';
import { Button } from '@nextui-org/button';
import { abi } from '@/abis/challenge';
import { challengeAddr } from '@/constants';
import { useAccount, useConnect, useReadContracts } from 'wagmi';
import { formatUnits, zeroAddress } from 'viem';
import { ChallengeStatus, UserStatus } from '@/types';
import moment from 'moment';
import usePasskeyConnection from '@/hooks/usePasskeyConnection';

export default function Claim() {
  const { push } = useRouter();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { login, isPending: connecting } = usePasskeyConnection();
  const { challenge, loading } = useChallenge(Number(challengeId));
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [isClaimedPopupOpen, setIsClaimedPopupOpen] = useState(false);

  const handleOpenClaimedPopup = () => setIsClaimedPopupOpen(true);
  const handleCloseClaimedPopup = () => setIsClaimedPopupOpen(false);
  const handleChallengeListClick = () => {
    push('/');
  };

  const { address: account } = useAccount();

  const { data } = useReadContracts({
    contracts: [
      {
        abi,
        address: challengeAddr,
        functionName: 'getWinningStakePerUser',
        args: [BigInt(challengeId)],
      },
      {
        abi,
        address: challengeAddr,
        functionName: 'totalSucceedUsers',
        args: [BigInt(challengeId)],
      },
      {
        abi,
        address: challengeAddr,
        functionName: 'userStatus',
        args: [BigInt(challengeId), account ?? zeroAddress],
      },
      {
        abi,
        address: challengeAddr,
        functionName: 'challengeStatus',
        args: [BigInt(challengeId)],
      },
    ],
    query: {
      enabled: !!account,
    },
  });

  const winningStakePerUser = data?.[0].result;
  const totalFinishedUsers = data?.[1].result;
  const userStatus = data?.[2].result;
  const challengeStatus = data?.[3].result as ChallengeStatus;

  const { onSubmitTransaction: onWithdrawTx, isLoading: isWithdrawLoading } = useWithdraw(
    BigInt(challenge?.id ?? 0),
    () => {
      setClaimSuccess(true);
      handleOpenClaimedPopup();
    },
  );

  const challengeHasEnded = challenge?.endTimestamp && Date.now() > challenge.endTimestamp * 1000;
  const userCanClaim =
    userStatus === UserStatus.Claimable &&
    winningStakePerUser !== undefined &&
    !!totalFinishedUsers;

  const claimed =
    userStatus === UserStatus.Claimed && !!winningStakePerUser && !!totalFinishedUsers;

  const canClaimNow = userCanClaim && challengeStatus === ChallengeStatus.Settled;

  return (
    <div className="mx-8 flex flex-col items-center justify-center">
      {/* Img and Description */}
      {challenge ? (
        <>
          <div className="col-span-3 flex w-full items-center justify-center">
            <p className="p-8 pt-2 text-center font-londrina text-xl">
              {' '}
              Congratulation on completing <p className="font-bold"> {challenge.name} </p>
            </p>
          </div>

          {/* details about what to claim */}
          {userCanClaim && (
            <div className="mx-4 my-8 w-full">
              <div className="flex items-center justify-between p-4 font-nunito text-sm">
                <p>Claimable</p>
                {challengeHasEnded ? (
                  <p> {formatUnits(winningStakePerUser, 6)} USDC</p>
                ) : (
                  <p> {formatUnits(challenge.stake, 6)}+ USDC</p>
                )}
              </div>
              <div className="flex items-center justify-between px-4 pb-4 font-nunito text-sm">
                <p>Total Finished</p>
                <p>{totalFinishedUsers.toString()}</p>
              </div>
              {!challengeHasEnded && (
                <div className="flex items-center justify-between px-4 pb-4 font-nunito text-sm">
                  <p>Challenge Ends</p>
                  <p>{moment.unix(challenge.endTimestamp).fromNow()}</p>
                </div>
              )}
            </div>
          )}
          {claimed && (
            <div className="mx-4 my-8 w-full">
              <div className="text-md flex items-center justify-between p-4 font-nunito">
                <p>{formatUnits(winningStakePerUser, 6)} USDC Claimed</p>
              </div>
            </div>
          )}

          {account === undefined ? (
            <Button onClick={login} className="mt-2 min-h-12 w-full" isLoading={connecting}>
              Connect Wallet
            </Button>
          ) : claimed || claimSuccess ? (
            <Button
              type="button"
              color="primary"
              className="mt-4 min-h-12 w-3/4 max-w-56"
              onClick={() => {
                push('/');
              }}
            >
              Start a new Challenge
            </Button>
          ) : (
            <Button
              // if unsettled, disable the button
              isDisabled={!canClaimNow}
              type="button"
              className="mt-4 min-h-12 w-3/4 max-w-56"
              color="primary"
              onClick={onWithdrawTx}
              isLoading={isWithdrawLoading}
            >
              Claim
            </Button>
          )}
        </>
      ) : loading ? (
        <div> Loading...</div>
      ) : (
        <div>Invalid Challenge Id</div>
      )}

      {/* wait for settle message */}
      {userCanClaim && !canClaimNow && (
        <div className="mt-2 text-xs text-default-400">Please wait for the challenge to settle</div>
      )}

      {isClaimedPopupOpen && (
        <ClaimedPopup
          onClose={handleCloseClaimedPopup}
          onCheckInPageClick={handleChallengeListClick}
        />
      )}
    </div>
  );
}
