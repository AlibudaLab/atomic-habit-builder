import { parseAbi } from 'viem';
import toast from 'react-hot-toast';

import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';
import { logEvent } from '@/utils/gtag';

const useTransferERC20 = (
  token: `0x${string}`,
  recipient: `0x${string}`,
  amount: bigint,
  onSuccess?: () => void,
) => {
  return useSubmitTransaction(
    {
      address: token,
      abi: parseAbi(['function transfer(address recipient, uint256 amount)']),
      functionName: 'transfer',
      args: [recipient, amount],
    },
    {
      onError: () => {
        toast.error('Error sending token. Please try again');
      },
      onSuccess: () => {
        //In the orginal file they refetch after success refetch();
        toast.success('Token sent!');
        onSuccess?.();
        logEvent({ action: 'withdraw', category: 'account', label: 'withdraw', value: 1 });
      },
    },
  );
};

export default useTransferERC20;
