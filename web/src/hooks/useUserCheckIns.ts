import { useMemo, useState, useEffect, useCallback } from 'react';

const useUserCheckIns = (address: string | undefined, challengeId: number) => {
  const [counter, setCounter] = useState(0);
  const [checkIns, setCheckIns] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!address) return;
      setLoading(true);
      try {
        console.log('fetch userCheckIns counter', counter);
        const response = await fetch(`/api/on-chain/${address}/${challengeId}/checkins`, {
          next: { revalidate: 0 },
        });
        if (!response.ok) throw new Error('Failed to fetch user status');
        const data = await response.json();
        setCheckIns(data.checkInCount);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchStatus().catch(console.error);
  }, [address, challengeId, counter]);

  const checkedIn = useMemo(() => (checkIns === undefined ? 0 : checkIns), [checkIns]);

  const refetch = useCallback(() => {
    setCounter((c) => c + 1);
  }, []);

  return { loading, checkedIn, error, refetch };
};

export default useUserCheckIns;
