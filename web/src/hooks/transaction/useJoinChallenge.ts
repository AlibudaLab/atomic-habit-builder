import toast from 'react-hot-toast';

import { abi as usdcAbi } from '@/abis/usdc';
import { abi as challengeAbi } from '@/abis/challenge';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address } from 'viem';
import { usdcAddr, challengeAddr } from '@/constants';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useJoinChallenge = (
  address: Address | undefined,
  challengeId: bigint,
  approveAmt?: bigint,
  onSuccess?: () => void,
) => {
  const txConfig = {
    contracts: [
      {
        address: usdcAddr,
        abi: usdcAbi,
        functionName: 'approve',
        args: [challengeAddr, approveAmt],
      },
      {
        address: challengeAddr,
        abi: challengeAbi,
        functionName: 'join',
        args: [challengeId],
      },
    ],
  };

  return useSubmitTransaction(txConfig, {
    onError: (e) => {
      if (e) console.log('Error while Joining Challenge:', e);
      toast.error('Error joining the challenge. Please try again', { id: 'join-challenge' });
    },
    onSuccess: () => {
      //In the orginal file they refetch after success refetch();
      toast.success('Joined! Directing to checkIn!', { id: 'join-challenge' });
      onSuccess?.();
    },
    onSent: () => {
      toast.loading('Transaction sent...', { id: 'join-challenge' });

      // update DB to reflect the user has joined the challenge
      // do this before it's confirmed, so if user refresh, we still get the correct state
      void fetch('/api/user/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: address,
          challengeId: Number(challengeId.toString()),
          isJoin: true,
        }),
      })
        .catch((e) => {
          toast.error('Error updating user challenges, please contact us', {
            id: 'join-challenge',
          });
        })
        .then(() => {});
    },
  });
};

export default useJoinChallenge;
