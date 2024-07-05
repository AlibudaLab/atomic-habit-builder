/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { formatUnits } from 'viem';
import useChallenge from '@/hooks/useChallenge';
import useWithdraw from '@/hooks/transaction/useWithdraw';
import GenerateByName from '@/components/Nouns/GenerateByName';
import ClaimedPopup from './ClaimedPopup';
import { Button } from '@nextui-org/button';

export default function Claim() {
  const { push } = useRouter();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge, loading } = useChallenge(Number(challengeId));
  const [isSuccess, setIsSuccess] = useState(false);

  const [isClaimedPopupOpen, setIsClaimedPopupOpen] = useState(false);

  const handleOpenClaimedPopup = () => setIsClaimedPopupOpen(true);
  const handleCloseClaimedPopup = () => setIsClaimedPopupOpen(false);
  const handleChallengeListClick = () => {
    push('/');
  };

  const { onSubmitTransaction: onWithdrawTx, isLoading: isWithdrawLoading } = useWithdraw(
    BigInt(challenge?.id ?? 0),
    () => {
      setIsSuccess(true);
      handleOpenClaimedPopup();
    },
  );

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      {challenge ? (
        <>
          <div className="col-span-3 flex w-full items-center justify-center">
            <p className="p-8 pt-2 text-center text-xl font-bold">
              {' '}
              Congratulation on completing {challenge.name}!
            </p>
          </div>

          {isSuccess ? (
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
              type="button"
              className="mt-4 min-h-12 w-3/4 max-w-56"
              color="primary"
              onClick={onWithdrawTx}
              isLoading={isWithdrawLoading}
            >
              Claim
            </Button>
          )}

          <div className="p-4 text-xs">Get back {formatUnits(challenge.stake, 6)} USDC.</div>

          <GenerateByName properties={{ name: 'You Success', alt: 'Step 4 Image' }} />
        </>
      ) : loading ? (
        <div> Loading...</div>
      ) : (
        <div>Invalid Challenge Id</div>
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
