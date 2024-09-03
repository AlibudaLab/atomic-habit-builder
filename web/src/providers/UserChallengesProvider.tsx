import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Challenge, ChallengeWithCheckIns } from '@/types';
import { useAllChallenges } from '@/providers/ChallengesProvider';
import { getUserChallengeStatus } from '@/utils/challenges';

type UserChallengesContextType = {
  loading: boolean;
  data: ChallengeWithCheckIns[];
  error: unknown | null;
  refetch: () => void;
}

const UserChallengesContext = createContext<UserChallengesContextType | undefined>(undefined);

export function UserChallengesProvider({children, address}:{children: React.ReactNode, address: string | undefined}) {
  const [loading, setLoading] = useState(address !== undefined);

  const [data, setData] = useState<ChallengeWithCheckIns[]>([]);
  const [error, setError] = useState<unknown | null>(null);
  const { challenges } = useAllChallenges();

  const fetchData = useCallback(async (resetLoading = true) => {
    if (!address || challenges.length === 0) return;

    try {
      if (resetLoading) setLoading(true);

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
        console.log('matchingOnchainData.checkInsCount', matchingOnchainData.checkInsCount)
        const userChallengeStatus = getUserChallengeStatus(
          Number(matchingOnchainData.userStatus), 
          matchingOnchainData.checkInsCount, 
          matchingOnchainData
        )
        return {
          ...c,
          checkedIn: matchingOnchainData.checkInsCount,
          succeedClaimable: BigInt(matchingOnchainData.winningStakePerUser),
          totalSucceeded: BigInt(matchingOnchainData.totalSucceedUsers),
          status: userChallengeStatus,
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
    void fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    void fetchData(false)
  }, [fetchData]);

  const value = useMemo(()=> { return { loading, data, error, refetch }; }, [loading, data, error, refetch]) 

  return <UserChallengesContext.Provider value={value}>{children}</UserChallengesContext.Provider>;
};

export const useUserChallenges = () => {
  const context = useContext(UserChallengesContext);
  if (context === undefined) {
    throw new Error('useUserChallenges must be used within a UserChallengesProvider');
  }
  return context;
};