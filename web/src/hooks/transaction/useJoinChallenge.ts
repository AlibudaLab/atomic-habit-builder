import toast from 'react-hot-toast';

import * as testTokenContract from '@/contracts/testToken';
import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address } from 'viem';

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
        address: testTokenContract.address,
        abi: testTokenContract.abi,
        functionName: 'approve',
        args: [trackerContract.address, approveAmt],
      },
      {
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'join',
        args: [challengeId],
      },
    ],
  };

  return useSubmitTransaction(txConfig, {
    onError: (e) => {
      if (e) console.log('Error while Joining Challenge:', e);
      toast.error('Error joining the challenge. Please try again');
    },
    onSuccess: () => {
      //In the orginal file they refetch after success refetch();
      toast.dismiss();
      toast.success('Joined! Directing to checkIn!');

      // update DB to reflect the user has joined the challenge
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
          toast.error('Error updating user challenges, please contact us');
        })
        .then(() => {});

      onSuccess?.();
    },
    onSent: () => {
      toast.loading('Transaction sent...');
    },
  });
};

export default useJoinChallenge;
