import toast from 'react-hot-toast';

import { abi } from '@/abis/challenge';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Hex, numberToHex } from 'viem';
import { challengeAddr } from '@/constants';
import { logEventSimple } from '@/utils/gtag';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

export type CheckInFields = {
  challengeId: number;
  signature: Hex;
  activityId: number;
};

const useCheckInRun = (fields: CheckInFields, onSuccess?: () => void) => {
  return useSubmitTransaction(
    {
      address: challengeAddr,
      abi: abi,
      functionName: 'checkIn',
      args: [
        fields.challengeId,
        numberToHex(fields.activityId).padEnd(32, '0'), //checkIn data, we use activityId
        fields.signature,
      ],
    },
    {
      onError: () => {
        toast.error('Error checking in.', {id: 'checkin'});
      },
      onSuccess: () => {
        toast.success('Successfully checked in!! 🥳🥳🥳', {id: 'checkin'});

        onSuccess?.();
        logEventSimple({ eventName: 'click_checkin', category: 'checkin' });
      },
      onSent: () => {
        toast.loading('Transaction sent...', {id: 'checkin'});
      },
    },
  );
};

export default useCheckInRun;
