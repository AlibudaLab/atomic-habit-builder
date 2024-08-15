import toast from 'react-hot-toast';

import { abi } from '@/abis/challenge';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { challengeAddr } from '@/constants';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useWithdraw = (challengeId: bigint, onSuccess?: () => void) => {
  return useSubmitTransaction(
    {
      address: challengeAddr,
      abi: abi,
      functionName: 'withdraw',
      args: [challengeId],
    },
    {
      onError: (error) => {
        toast.error('Error while claiming: ' + error);
      },
      onSuccess: () => {
        //In the orginal file they refetch after success refetch();
        toast.success('Successfully Claimed!');
      },
    },
  );
};

export default useWithdraw;
