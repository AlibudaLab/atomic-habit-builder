import toast from 'react-hot-toast';

import * as trackerContract from '@/contracts/tracker';
import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { Address } from 'viem';

const useCreateChallenge = (
  verifier: Address, 
  extraData: string,
  minimumCheckIns: number,
  startTimestamp: number,
  joinDueTimestamp: number,
  endTimestamp: number,
  donateDestination: Address,
  stake: bigint,
  onSuccess?: () => void,
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
          stake,
        ]
      },
      {
        onError: () => {
          toast.error('Error Creating a Challenge.');
        },
        onSuccess: () => {
          toast.dismiss();
          toast.success('Successfully created!! 🥳🥳🥳');

          onSuccess?.();
        },
      },
    )
};

export default useCreateChallenge;
