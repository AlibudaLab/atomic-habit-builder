'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useChallenge from '@/hooks/useChallenge';
import useWithdraw from '@/hooks/transaction/useWithdraw';
import ClaimedPopup from './ClaimedPopup';
import { Button } from '@nextui-org/button';
import { abi, address } from '@/contracts/tracker';
import { useAccount, useConnect, useReadContracts } from 'wagmi';
import { formatUnits, zeroAddress } from 'viem';

export default function Claim() {
  const { push } = useRouter();
  const { challengeId } = useParams<{ challengeId: string }>();
  const { connect, connectors, isPending: connecting } = useConnect();
  const { challenge, loading } = useChallenge(Number(challengeId));
  const [isSuccess, setIsSuccess] = useState(false);

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
        address,
        functionName: 'getClaimableAmount',
        args: [BigInt(challengeId), account ?? zeroAddress],
      },
      {
        abi,
        address,
        functionName: 'getChallengeSucceedParticipantsCount',
        args: [BigInt(challengeId)],
      },
    ],
    query: {
      enabled: !!account,
    },
  });

  const claimable = data?.[0].result;
  const totalFinishedParticipants = data?.[1].result;

  const { onSubmitTransaction: onWithdrawTx, isLoading: isWithdrawLoading } = useWithdraw(
    BigInt(challenge?.id ?? 0),
    () => {
      setIsSuccess(true);
      handleOpenClaimedPopup();
    },
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
          {claimable !== undefined && totalFinishedParticipants !== undefined && (
            <div className="my-8 w-full mx-4">
              <div className="text-md font-roboto flex items-center justify-between p-4">
                <p>Claimable</p>
                <p>{formatUnits(claimable, 6)} USDC</p>
              </div>
              <div className="text-md font-roboto flex items-center justify-between px-4 pb-4">
                <p>Total Finished</p>
                <p>{totalFinishedParticipants.toString()}</p>
              </div>
            </div>
          )}

          {account === undefined ? (
            <Button
              onClick={() => connect({ connector: connectors[0] })}
              className="mt-2 min-h-12 w-full"
              isLoading={connecting}
            >
              Connect Wallet
            </Button>
          ) : isSuccess ? (
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
