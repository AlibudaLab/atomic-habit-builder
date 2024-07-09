import toast from 'react-hot-toast';

import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address, DecodeEventLogReturnType, zeroAddress } from 'viem';

const useCreateChallenge = (
  verifier: Address,
  extraData: string,
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
      address: trackerContract.address,
      abi: trackerContract.abi,
      functionName: 'register',
      args: [
        verifier,
        extraData,
        minimumCheckIns,
        startTimestamp,
        joinDueTimestamp,
        endTimestamp,
        donateDestination,
        zeroAddress, // checkin-Judge
        underlying,
        stake,
      ],
    },
    {
      onError: () => {
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
