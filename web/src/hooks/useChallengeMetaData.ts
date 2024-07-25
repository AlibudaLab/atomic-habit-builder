// hooks/useChallenges.ts
import { ChallengeMetaData } from '@/types';
import { useState, useEffect } from 'react';

const useChallengeMetaDatas = () => {
  const [challengesMetaDatas, setChallengeMetaDatas] = useState<ChallengeMetaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await fetch('/api/challenge-metadata', {
          next: {
            tags: ['fetch'],
          }
        });
        const data = await response.json();
        setChallengeMetaDatas(data as ChallengeMetaData[]);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges().then(console.log).catch(console.error);
  }, []);

  return { challengesMetaDatas, loading, error };
};

export default useChallengeMetaDatas;
