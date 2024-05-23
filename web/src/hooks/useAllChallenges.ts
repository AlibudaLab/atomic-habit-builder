import { readContract } from '@wagmi/core';
import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Address } from 'viem';
import { Challenge } from '@/types';
import { challengeMetaDatas } from '@/constants';

const useAllChallenges = () => {
  const publicClient = usePublicClient({ config });

  const [loading, setLoading] = useState(true);
  const [challenges, setChallenges] = useState<Challenge[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!publicClient?.multicall) return;

    const fetchData = async () => {
      try {
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
            args: [i],
          })),
        });

        const newData: Challenge[] = result
          .map((raw, idx) => {
            const res = raw.result as any as [
              Address,
              bigint,
              bigint,
              bigint,
              Address,
              bigint,
              bigint,
              boolean,
            ];
            return {
              id: BigInt(idx),
              verifier: res[0],
              targetNum: Number(res[1].toString()),
              startTimestamp: Number(res[2].toString()),
              endTimestamp: Number(res[3].toString()),
              donationDestination: res[4],
              stake: res[5],
            };
          })
          .map((c) => {
            const matchingMetaData = challengeMetaDatas.find((meta) => meta.id === c.id);
            if (!matchingMetaData) return undefined;
            return { ...c, ...matchingMetaData };
          })
          .filter((c) => c !== undefined) as Challenge[];

        setChallenges(newData);

        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [publicClient]);

  return { loading, challenges, error };
};

export default useAllChallenges;
