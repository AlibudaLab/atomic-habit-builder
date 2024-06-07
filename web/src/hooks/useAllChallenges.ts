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
            args: [i + 1],
          })),
        });

        const newData: Challenge[] = result
          .map((raw, idx) => {
            const res = raw.result as any as [
              Address,
              number, // checkins
              number, // start
              number, // join due
              number, // end
              Address, // donation
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
              stake: res[6],
            };
          })
          .sort((a, b) => (a.startTimestamp > b.startTimestamp ? 1 : -1))
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
