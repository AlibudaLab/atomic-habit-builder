import toast from 'react-hot-toast';

import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

export type CheckInFields = {
  challengeId: number;
  timestamp: number;
  v: number;
  r: string;
  s: string;
  activityId: number;
};

const useCheckInRun = (fields: CheckInFields, onSuccess?: () => void) => {
  return useSubmitTransaction(
    {
      address: trackerContract.address,
      abi: trackerContract.abi,
      functionName: 'checkIn',
      args: [
        fields.challengeId,
        fields.timestamp,
        fields.v,
        `0x${fields.r.padStart(64, '0')}`,
        `0x${fields.s.padStart(64, '0')}`,
      ],
    },
    {
      onError: () => {
        toast.error('Error checking in.');
      },
      onSuccess: () => {
        toast.dismiss();
        toast.success('Successfully checked in!! 🥳🥳🥳');

        onSuccess?.();
      },
    },
  );
};

export default useCheckInRun;
