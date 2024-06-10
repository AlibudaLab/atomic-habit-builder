import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import moment from 'moment';

import { Challenge } from '@/types';
import { ChallengeTypes } from '@/constants';
import * as trackerContract from '@/contracts/tracker';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import useRunData from '@/hooks/useRunData';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useCheckInRun = (challenge: Challenge, activityId?: number, onSuccess?: () => void) => {
  const { address } = useAccount();
  const { runData, workoutData } = useRunData();
  const [timestamp, setTimestamp] = useState<number>(0);
  const [signature, setSignature] = useState<{ v: number; r: string; s: string } | null>(null);

  useEffect(() => {
    if (activityId === null || signature !== null) return;

    const now = moment().unix();

    const fetchURL =
      activityId !== undefined
        ? '/api/sign?' +
          new URLSearchParams({
            address: address as string,
            activityId: activityId.toString(),
            timestamp: now.toString(),
            challengeId: challenge.id.toString(),
          }).toString()
        : '';

    const fetchSignature = async (): Promise<{ v: number; r: string; s: string }> => {
      const response = await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    };

    fetchSignature()
      .then((_signature) => {
        setSignature(_signature);
        setTimestamp(now);
        console.log('Signature:', _signature);
        console.log('Timestamp:', now);
      })
      .catch((error) => {
        console.error('Error fetching the signature:', error);
      });
  }, [activityId, signature, address, challenge.id]);

  return {
    activityId,
    checkIn: useSubmitTransaction(
      {
        address: trackerContract.address,
        abi: trackerContract.abi,
        functionName: 'checkIn',
        args: signature
          ? [
              challenge.id,
              timestamp,
              signature.v,
              `0x${signature.r.padStart(64, '0')}`,
              `0x${signature.s.padStart(64, '0')}`,
            ]
          : [],
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
    ),
  };
};

export default useCheckInRun;
