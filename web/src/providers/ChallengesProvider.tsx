import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { Challenge, ChallengeDetail, ChallengeStatus } from '@/types';
import useChallengeMetaDatas from '../hooks/useChallengeMetaDatas';

type AllChallengesContextType = {
  loading: boolean;
  challenges: Challenge[];
  error: unknown | null;
  refetch: () => void;
  refetchOnChainData: () => void;
};

const AllChallengesContext = createContext<AllChallengesContextType | undefined>(undefined);

export const useAllChallenges = () => {
  const context = useContext(AllChallengesContext);
  if (!context) {
    throw new Error('useAllChallenges must be used within an AllChallengesProvider');
  }
  return context;
};

type AllChallengesProviderProps = {
  children: ReactNode;
};

export function AllChallengesProvider({ children }: AllChallengesProviderProps) {
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const {
    challengesMetaDatas,
    loading: loadingMetaData,
    refetch: refetchMetaData,
  } = useChallengeMetaDatas();

  const fetchChallenges = useCallback(
    async (resetLoading = true) => {
      if (loadingMetaData) return;

      try {
        if (resetLoading) setLoading(true);
        const response = await fetch(`/api/on-chain/challenges`, { next: { revalidate: 0 } });
        if (!response.ok) throw new Error('Failed to fetch challenges');
        const result = await response.json();

        const newData: Challenge[] = result.challenges
          .map((challenge: any) => ({
            id: BigInt(challenge.id),
            verifier: challenge.verifier,
            minimumCheckIns: Number(challenge.minimumCheckIns),
            startTimestamp: Number(challenge.startTimestamp),
            joinDueTimestamp: Number(challenge.joinDueTimestamp),
            endTimestamp: Number(challenge.endTimestamp),
            donationDestination: challenge.donateDestination,
            stake: BigInt(challenge.stakePerUser),
            participants: Number(challenge.totalUsers),
            totalStaked: BigInt(challenge.totalStake),
            succeedClaimable: BigInt(challenge.winningStakePerUser),
            challengeStatus: challenge.status as ChallengeStatus,
            joinedUsers: challenge.joinedUsers,
          }))
          .sort((a: ChallengeDetail, b: ChallengeDetail) =>
            a.startTimestamp > b.startTimestamp ? 1 : -1,
          )
          .map((c: ChallengeDetail) => {
            const matchingMetaData = challengesMetaDatas.find(
              (meta) => meta.id === Number(c.id.toString()),
            );
            if (!matchingMetaData) return undefined;
            return { ...c, ...matchingMetaData };
          })
          .filter((c: ChallengeDetail) => c !== undefined) as Challenge[];

        setChallenges(newData);
        setError(null);
      } catch (_error) {
        setError(_error);
      } finally {
        setLoading(false);
      }
    },
    [loadingMetaData, challengesMetaDatas],
  );

  useEffect(() => {
    void fetchChallenges(true);
  }, [fetchChallenges]);

  const refetch = useCallback(() => {
    void refetchMetaData();
    void fetchChallenges(false);
  }, [refetchMetaData, fetchChallenges]);

  // do not refetch metadata
  const refetchOnChainData = useCallback(() => {
    void fetchChallenges(false);
  }, [fetchChallenges]);

  const contextValue = useMemo(
    () => ({
      loading,
      challenges,
      error,
      refetch,
      refetchOnChainData,
    }),
    [loading, challenges, error, refetch, refetchOnChainData],
  );

  return (
    <AllChallengesContext.Provider value={contextValue}>{children}</AllChallengesContext.Provider>
  );
}
