
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { readContract } from '@wagmi/core';
import { abi as challengeAbi } from '@/abis/challenge';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { Challenge } from '@/types';
import useChallengeMetaDatas from '../hooks/useChallengeMetaDatas';
import { challengeAddr } from '@/constants';

type AllChallengesContextType = {
  loading: boolean;
  challenges: Challenge[];
  error: unknown | null;
  refetch: () => void;
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
  const publicClient = usePublicClient({ config });

  const [counter, setCounter] = useState(0);
  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const {
    challengesMetaDatas,
    loading: loadingMetaData,
    refetch: refetchMetaData,
  } = useChallengeMetaDatas();

  const refetch = useCallback(() => {
    refetchMetaData();
    setCounter((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!publicClient?.multicall) return;
    if (loadingMetaData) return;

    const fetchData = async () => {
      try {
        console.log('fetch challenges counter', counter);
        setLoading(true);

        const challengeCount = await readContract(config, {
          abi: challengeAbi,
          address: challengeAddr,
          functionName: 'challengeCounter',
        });

        const result = await publicClient.multicall({
          contracts: Array.from({ length: Number(challengeCount.toString()) }, (_, i) => ({
            address: challengeAddr,
            abi: challengeAbi,
            functionName: 'getChallenge',
            args: [i + 1],
          })),
        });

        const participantsRes = (await publicClient.multicall({
          contracts: Array.from({ length: Number(challengeCount.toString()) }, (_, i) => ({
            address: challengeAddr,
            abi: challengeAbi,
            functionName: 'totalUsers',
            args: [i + 1],
          })),
        })) as { result: bigint }[];

        const newData: Challenge[] = result
          .map((raw, idx) => {
            const res = raw.result as any as {
              verifier: Address;
              minimumCheckIns: bigint;
              startTimestamp: bigint;
              joinDueTimestamp: bigint;
              endTimestamp: bigint;
              donateDestination: Address;
              stakePerUser: bigint;
            };

            const participants = participantsRes[idx].result;

            return {
              id: BigInt(idx + 1),
              verifier: res.verifier,
              targetNum: Number(res.minimumCheckIns.toString()),
              startTimestamp: Number(res.startTimestamp.toString()),
              joinDueTimestamp: Number(res.joinDueTimestamp.toString()),
              endTimestamp: Number(res.endTimestamp.toString()),
              donationDestination: res.donateDestination,
              stake: res.stakePerUser,
              participants: Number(participants.toString()),
              totalStaked: res.stakePerUser * participants,
            };
          })
          .sort((a, b) => (a.startTimestamp > b.startTimestamp ? 1 : -1))
          .map((c) => {
            const matchingMetaData = challengesMetaDatas.find(
              (meta) => meta.id === Number(c.id.toString()),
            );
            if (!matchingMetaData) return undefined;
            return { ...c, ...matchingMetaData };
          })
          .filter((c) => c !== undefined) as Challenge[];

        setChallenges(newData);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [publicClient, loadingMetaData, challengesMetaDatas, counter]);

  const contextValue = useMemo(
    () => ({
      loading,
      challenges,
      error,
      refetch,
    }),
    [loading, challenges, error],
  );

  return (
    <AllChallengesContext.Provider value={contextValue}>{children}</AllChallengesContext.Provider>
  );
}
