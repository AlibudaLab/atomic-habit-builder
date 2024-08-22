// hooks/useChallenges.ts
import { ChallengeMetaData } from '@/types';
import { useState, useEffect, useCallback } from 'react';

const useChallengeMetaDatas = () => {
  const [counter, setCounter] = useState(0);
  const [challengesMetaDatas, setChallengeMetaDatas] = useState<ChallengeMetaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        console.log('fetch challenges counter', counter);
        const response = await fetch('/api/challenge-metadata', { next: { revalidate: 0 } });
        const data = await response.json();
        setChallengeMetaDatas(data as ChallengeMetaData[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges().then(console.log).catch(console.error);
  }, [counter]);

  return { challengesMetaDatas, loading, error, refetch };
};

export default useChallengeMetaDatas;
