import { Chain, parseAbi } from 'viem';
import toast from 'react-hot-toast';

import useTransactionArbitraryChain from '@/hooks/transaction/useTransactionArbitraryChain';
import { logEventSimple } from '@/utils/gtag';

const useTransferERC20ArbitraryChain = (
  token: `0x${string}`,
  recipient: `0x${string}`,
  amount: bigint,
  chain: Chain,
  onSuccess?: () => void,
) => {
  return useTransactionArbitraryChain(
    {
      address: token,
      abi: parseAbi(['function transfer(address recipient, uint256 amount)']),
      functionName: 'transfer',
      args: [recipient, amount],
      chain: chain,
    },
    {
      onError: () => {
        toast.error('Error sending token. Please try again');
      },
      onSuccess: () => {
        //In the orginal file they refetch after success refetch();
        toast.success('Token sent!');
        onSuccess?.();
        logEventSimple({ eventName: 'clieck_withdraw', category: 'others' });
      },
    },
  );
};

export default useTransferERC20ArbitraryChain;
