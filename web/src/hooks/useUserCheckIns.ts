import { abi } from '@/abis/challenge';
import { useMemo } from 'react';
import { challengeAddr } from '@/constants';
import { useReadContract } from 'wagmi';

const useUserCheckIns = (address: string | undefined, challengeId: number) => {
  const {
    data,
    status: queryStatus,
    refetch,
  } = useReadContract({
    abi,
    address: challengeAddr,
    functionName: 'getUserCheckInCounts',
    args: [BigInt(challengeId), address as `0x${string}`],
  });

  const loading = useMemo(() => queryStatus === 'pending', [queryStatus]);
  const error = useMemo(() => queryStatus === 'error', [queryStatus]);

  const checkedIn = useMemo(() => (data === undefined ? 0 : Number(data)), [data]);

  return { loading, checkedIn, error, refetch };
};

export default useUserCheckIns;
