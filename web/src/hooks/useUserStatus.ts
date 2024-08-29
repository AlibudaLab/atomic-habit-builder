import { useMemo, useState, useEffect, useCallback } from 'react';
import { UserStatus } from '@/types';

const useUserStatus = (address: string | undefined, challengeId: number) => {
  const [counter, setCounter] = useState(0);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!address) return;
      setLoading(true);
      try {
        console.log('fetch userState counter', counter);
        const response = await fetch(`/api/on-chain/${address}/${challengeId}/userStatus`, {
          next: { revalidate: 0 },
        });
        if (!response.ok) throw new Error('Failed to fetch user status');
        const data = await response.json();
        setStatus(data.userStatus);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus().catch(console.error);
  }, [address, challengeId, counter]);

  const joined = useMemo(() => status !== null && status >= UserStatus.Joined, [status]);

  const refetch = useCallback(() => {
    setCounter((c) => c + 1);
  }, []);

  return { loading, joined, error, status, refetch };
};

export default useUserStatus;
