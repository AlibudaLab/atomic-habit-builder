import { abi } from '@/abis/challenge';
import { useMemo } from 'react';
import { UserStatus } from '@/types';
import { challengeAddr } from '@/constants';
import { useReadContract } from 'wagmi';

const useUserStatus = (address: string | undefined, challengeId: number) => {
  const {
    data: status,
    status: queryStatus,
    refetch,
  } = useReadContract({
    abi,
    address: challengeAddr,
    functionName: 'userStatus',
    args: [BigInt(challengeId), address as `0x${string}`],
  });

  const joined = status ? status >= UserStatus.Joined : false;

  const loading = useMemo(() => queryStatus === 'pending', [queryStatus]);
  const error = useMemo(() => queryStatus === 'error', [queryStatus]);

  return { loading, joined, error, status, refetch };
};

export default useUserStatus;
