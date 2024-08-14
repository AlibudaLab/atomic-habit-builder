import toast from 'react-hot-toast';

import * as challengeContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address, DecodeEventLogReturnType, zeroAddress } from 'viem';

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
      address: challengeContract.address,
      abi: challengeContract.abi,
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
        toast.error('Error Creating a Challenge.');
      },
      onSuccess: (reciept, events) => {
        toast.dismiss();
        toast.success('Successfully created!! 🥳🥳🥳');
        onSuccess?.(reciept, events);
      },
      onSent: () => {
        toast.loading('Transaction sent...');
      },
    },
  );
};

export default useCreateChallenge;
