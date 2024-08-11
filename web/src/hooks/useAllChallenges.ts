import { readContract } from '@wagmi/core';
import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { Challenge } from '@/types';
import useChallengeMetaDatas from './useChallengeMetaData';

const useAllChallenges = (publicOnly: boolean) => {
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
          abi: trackerContract.abi,
          address: trackerContract.address,
          functionName: 'challengeCounter',
        });

        const result = await publicClient.multicall({
          contracts: Array.from({ length: Number(challengeCount.toString()) }, (_, i) => ({
            address: trackerContract.address,
            abi: trackerContract.abi,
            functionName: 'challenges',
            args: [i + 1],
          })),
        });

        const participantsRes = (await publicClient.multicall({
          contracts: Array.from({ length: Number(challengeCount.toString()) }, (_, i) => ({
            address: trackerContract.address,
            abi: trackerContract.abi,
            functionName: 'getChallengeParticipantsCount',
            args: [i + 1],
          })),
        })) as { result: bigint }[];

        const newData: Challenge[] = result
          .map((raw, idx) => {
            const res = raw.result as any as [
              Address,
              number, // checkins
              number, // start
              number, // join due
              number, // end
              Address, // donation
              Address, // check in judge
              Address, // underlying
              bigint, // stake
              bigint, // total staked
              boolean,
            ];

            return {
              id: BigInt(idx + 1),
              verifier: res[0],
              targetNum: Number(res[1].toString()),
              startTimestamp: Number(res[2].toString()),
              joinDueTimestamp: Number(res[3].toString()),
              endTimestamp: Number(res[4].toString()),
              donationDestination: res[5],
              stake: res[8],
              participants: Number(participantsRes[idx].result.toString()),
              totalStaked: res[9],
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
          .filter((c) => !publicOnly || c?.public) as Challenge[];

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
