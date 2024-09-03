import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Challenge, ChallengeWithCheckIns } from '@/types';
import { useAllChallenges } from '@/providers/ChallengesProvider';

interface UserChallengesContextType {
  loading: boolean;
  data: ChallengeWithCheckIns[];
  error: unknown | null;
  refetch: () => void;
}

const UserChallengesContext = createContext<UserChallengesContextType | undefined>(undefined);

export const UserChallengesProvider: React.FC<{
  children: React.ReactNode;
  address: string | undefined;
}> = ({ children, address }) => {
  const [loading, setLoading] = useState(address !== undefined);
  const [data, setData] = useState<ChallengeWithCheckIns[]>([]);
  const [error, setError] = useState<unknown | null>(null);
  const { challenges } = useAllChallenges();

  const fetchData = useCallback(async () => {
    if (!address || challenges.length === 0) return;

    try {
      setLoading(true);

      console.log('fetching user challenges');

      const response = await fetch(`/api/on-chain/${address}/challenges`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch challenge');
      const result = await response.json();

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
  }, [address, challenges]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  const value = { loading, data, error, refetch };

  return <UserChallengesContext.Provider value={value}>{children}</UserChallengesContext.Provider>;
};

export const useUserChallenges = () => {
  const context = useContext(UserChallengesContext);
  if (context === undefined) {
    throw new Error('useUserChallenges must be used within a UserChallengesProvider');
  }
  return context;
};
