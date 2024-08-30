import { useState, useEffect } from 'react';
import { Challenge, ChallengeWithCheckIns } from '@/types';
import { useAllChallenges } from '@/providers/ChallengesProvider';

const useUserChallenges = (address: string | undefined) => {
  // when address is undefined, loading is false
  const [loading, setLoading] = useState(address !== undefined);

  const { challenges } = useAllChallenges();

  const [data, setData] = useState<ChallengeWithCheckIns[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;
    if (challenges.length === 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await fetch(`/api/on-chain/${address}/challenges`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch challenge');
        const result = await response.json();

        // all challenges that user participants in
        const knownChallenges = challenges.filter((c) =>
          result.challenges.some((rc: { id: number }) => rc.id === c.id),
        );

        const challengesWithCheckIns: ChallengeWithCheckIns[] = knownChallenges.map((c) => {
          const matchingOnchainData = result.challenges.find(
            (challenge: Challenge) => challenge.id === Number(c.id.toString()),
          );
          return {
            ...c,
            checkedIn: Number(matchingOnchainData.checkInsCount.toString()),
            succeedClaimable: BigInt(matchingOnchainData.winningStakePerUser),
            totalSucceeded: BigInt(matchingOnchainData.totalSucceedUsers),
            status: Number(matchingOnchainData.userStatus),
          };
        });

        setData(challengesWithCheckIns);
        setLoading(false);
      } catch (_error) {
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [address, challenges]);

  console.log('data', data);

  return { loading, data, error };
};

export default useUserChallenges;
