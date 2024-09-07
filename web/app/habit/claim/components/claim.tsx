'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useWithdraw from '@/hooks/transaction/useWithdraw';
import ClaimedPopup from './ClaimedPopup';
import { Button } from '@nextui-org/button';
import { useAccount } from 'wagmi';
import { formatUnits } from 'viem';
import { ChallengeStatus, UserChallengeStatus } from '@/types';
import moment from 'moment';
import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { useChallengeWithCheckIns } from '@/hooks/useChallengeWithCheckIns';
import { logEventSimple } from '@/utils/gtag';

export default function Claim() {
  const { push } = useRouter();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { login, isPending: connecting } = usePasskeyConnection();
  const { challenge, loading, refetch } = useChallengeWithCheckIns(Number(challengeId));
  const [claimSuccess, setClaimSuccess] = useState(false);

  const [isClaimedPopupOpen, setIsClaimedPopupOpen] = useState(false);

  const handleOpenClaimedPopup = () => setIsClaimedPopupOpen(true);
  const handleCloseClaimedPopup = () => setIsClaimedPopupOpen(false);
  const handleChallengeListClick = () => {
    push('/');
  };

  const { address: account } = useAccount();

  const needSettle = useMemo(
    () => challenge?.challengeStatus !== ChallengeStatus.Settled,
    [challenge?.status],
  );

  const { onSubmitTransaction: onWithdrawTx, isLoading: isWithdrawLoading } = useWithdraw(
    needSettle,
    BigInt(challenge?.id ?? 0),
    () => {
      setClaimSuccess(true);
      refetch();
      handleOpenClaimedPopup();
      logEventSimple({ eventName: 'click_claim_reward', category: 'challenge' });
    },
  );

  const challengeHasEnded = useMemo(
    () => challenge?.endTimestamp && moment().unix() > challenge.endTimestamp,
    [challenge?.endTimestamp],
  );

  const userCanClaim = useMemo(
    () => challenge?.status === UserChallengeStatus.Claimable,
    [challenge?.status],
  );
  const claimed = useMemo(
    () => challenge?.status === UserChallengeStatus.Claimed,
    [challenge?.status],
  );

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
                <p> {claimed ? 'Claimed' : 'Claimable'} </p>
                {challengeHasEnded ? (
                  <p> {formatUnits(challenge.succeedClaimable, 6)} USDC</p>
                ) : (
                  <p> {formatUnits(challenge.stake, 6)}+ USDC</p>
                )}
              </div>
              <div className="flex items-center justify-between px-4 pb-4 font-nunito text-sm">
                <p>Total Finished</p>
                <p>{challenge.totalSucceeded.toString()}</p>
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
                <p>{formatUnits(challenge.succeedClaimable, 6)} USDC Claimed</p>
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
              isDisabled={!userCanClaim}
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
      {userCanClaim && !userCanClaim && (
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
