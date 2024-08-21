import toast from 'react-hot-toast';

import { abi } from '@/abis/challenge';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address, DecodeEventLogReturnType, zeroAddress } from 'viem';
import { challengeAddr } from '@/constants';

const useCreateChallenge = (
  verifier: Address,
  minimumCheckIns: number,
  startTimestamp: number,
  joinDueTimestamp: number,
  endTimestamp: number,
  donateDestination: Address,
  underlying: Address,
  stake: bigint,
  onSuccess?: (receipt: any, events: DecodeEventLogReturnType[]) => void,
) => {
  return useSubmitTransaction(
    {
      address: challengeAddr,
      abi: abi,
      functionName: 'create',
      args: [
        {
          verifier: verifier,
          minimumCheckIns: minimumCheckIns,
          startTimestamp: startTimestamp,
          joinDueTimestamp: joinDueTimestamp,
          endTimestamp: endTimestamp,
          donateDestination: donateDestination,
          checkInJudge: zeroAddress, // checkin-Judge
          asset: underlying,
          donationBPS: 5000, // 50% BPS
          stakePerUser: stake,
        },
      ],
    },
    {
      onError: (e) => {
        console.log('e', e);
        toast.error('Error Creating a Challenge.', { id: 'create' });
      },
      onSuccess: (reciept, events) => {
        toast.loading('Writing to DB...', { id: 'create' });
        onSuccess?.(reciept, events);
      },
      onSent: () => {
        toast.loading('Transaction sent...', { id: 'create' });
      },
    },
  );
};

export default useCreateChallenge;
