import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccount } from 'wagmi';
import moment from 'moment';

import { Challenge } from '@/types';
import * as trackerContract from '@/contracts/tracker';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useCheckInNFC = (challenge: Challenge, tapNFT?: boolean, onSuccess?: () => void) => {
  const { address } = useAccount();
  const [signature, setSignature] = useState<{ v: number; r: string; s: string } | null>(null);

  // todo: change this to get the timestamp of the exercise
  const timestamp = moment().unix();

  useEffect(() => {
    console.log('useCheckInNFC before', tapNFT);
    if (!tapNFT || signature !== null) return;
    console.log('useCheckInNFC after', tapNFT);
    const checkInMessage = getCheckinMessage(address as `0x${string}`, timestamp);
    const fetchSignature = async (): Promise<{ v: number; r: string; s: string }> => {
      toast.loading('Sensing NFC...');
      const arxSignature = await arxSignMessage(checkInMessage);
      const { v, r, s } = arxSignature.signature.raw;
      return { v, r, s };
    };
    fetchSignature()
      .then((_signature) => {
        setSignature(_signature);
      })
      .catch((error) => {
        console.error('Error fetching the signature:', error);
      });
  }, [tapNFT, signature, address, timestamp]);

  return {
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

export default useCheckInNFC;
