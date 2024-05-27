import toast from 'react-hot-toast';

import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useCheckIn = (
  challengeId: bigint,
  timestamp: bigint,
  v: number,
  r: `0x${string}`,
  s: `0x${string}`,
  onSuccess?: () => void,
) => {
  return useSubmitTransaction(
    {
      address: trackerContract.address,
      abi: trackerContract.abi,
      functionName: 'checkIn',
      args: [challengeId, timestamp, v, r, s],
    },
    {
      onError: () => {
        toast.error('Error checking in.');
      },
      onSuccess: () => {
        //In the orginal file they refetch after success refetch();
        toast.dismiss();
        toast.success('Successfully checked in!! 🥳🥳🥳');
        onSuccess?.();
      },
    },
  );
};

export default useCheckIn;
