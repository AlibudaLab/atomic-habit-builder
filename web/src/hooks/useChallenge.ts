import { useState, useEffect } from 'react';
import { Challenge } from '@/types';
import useChallengeMetaDatas from './useChallengeMetaDatas';

const useChallenge = (id: number) => {
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const { challengesMetaDatas, loading: loadingMetaData } = useChallengeMetaDatas();

  useEffect(() => {
    if (challengesMetaDatas.length === 0) return;
    if (loadingMetaData) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/on-chain/challenges/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const result = await response.json();

        const metaData = challengesMetaDatas.find((c) => c.id.toString() === id.toString());
        if (!metaData) return;

        const data = {
          verifier: result.verifier,
          targetNum: Number(result.minimumCheckIns),
          startTimestamp: Number(result.startTimestamp),
          joinDueTimestamp: Number(result.joinDueTimestamp),
          endTimestamp: Number(result.endTimestamp),
          donationDestination: result.donateDestination,
          participants: Number(result.totalUsers),
          stake: result.stakePerUser,
          totalStaked: result.totalStake,
          ...metaData,
        };

        setChallenge(data);
      } catch (_error) {
        setError(_error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [id, challengesMetaDatas, loadingMetaData]);

  return { loading, challenge, error };
};

export default useChallenge;
