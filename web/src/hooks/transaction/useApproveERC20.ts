import { parseAbi } from 'viem';
import toast from 'react-hot-toast';

import useSubmitTransaction from '@/hooks/transaction/useSubmitTransaction';

/**
 * @description This fill was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/requirements/Payment/components/WithdrawButton/hooks/useWithdraw.ts
 * useShowErrorToast and useToast was removed
 */

const useApproveERC20 = (token: `0x${string}`, spender: `0x${string}`, amount: bigint) => {
  return useSubmitTransaction(
    {
      address: token,
      abi: parseAbi(['function approve(address spender, uint256 amount)']),
      functionName: 'approve',
      args: [spender, amount],
    },
    {
      onError: () => {
        toast.error('Error approving test token. Please try again');
      },
      onSuccess: () => {
        //In the orginal file they refetch after success refetch();
        toast.success('Approved! Your allowance is set!');
      },
    },
  );
};

export default useApproveERC20;
