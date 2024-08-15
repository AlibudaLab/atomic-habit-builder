import { readContract } from '@wagmi/core';
import { abi as challengeAbi } from '@/abis/challenge';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { Challenge } from '@/types';
import useChallengeMetaDatas from './useChallengeMetaData';
import { challengeAddr } from '@/constants';

const useAllChallenges = (publicOnly: boolean, connectedUser: string | undefined) => {
  const publicClient = usePublicClient({ config });

  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  const { challengesMetaDatas, loading: loadingMetaData } = useChallengeMetaDatas();

  useEffect(() => {
    if (!publicClient?.multicall) return;
    if (loadingMetaData) return;

    const fetchData = async () => {
      try {
        console.log('start fetching');
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
          .filter((c) => c !== undefined)
          // if publicOnly is true
          // only show public challenges, or if private challenge is created by the connected user
          .filter((c) => {
            if (publicOnly) {
              // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
              return c?.public || c?.creator === connectedUser;
            } else {
              return true;
            }
          }) as Challenge[];

        setChallenges(newData);

        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [publicClient, loadingMetaData, challengesMetaDatas, publicOnly]);

  return { loading, challenges, error };
};

export default useAllChallenges;
