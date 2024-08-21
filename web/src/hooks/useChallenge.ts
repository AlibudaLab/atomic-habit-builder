import { abi } from '@/abis/challenge';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Challenge } from '@/types';
import useChallengeMetaDatas from './useChallengeMetaData';
import { challengeAddr } from '@/constants';

const useChallenge = (id: number) => {
  const publicClient = usePublicClient({ config });
  const [loading, setLoading] = useState(true);
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const { challengesMetaDatas, loading: loadingMetaData } = useChallengeMetaDatas();

  useEffect(() => {
    if (!publicClient?.multicall) return;
    if (challengesMetaDatas.length === 0) return;
    if (loadingMetaData) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [challengeRes, participantCount] = await publicClient.multicall({
          contracts: [
            {
              address: challengeAddr,
              abi,
              functionName: 'getChallenge',
              args: [BigInt(id.toString())],
            },
            {
              address: challengeAddr,
              abi,
              functionName: 'totalUsers',
              args: [BigInt(id.toString())],
            },
          ],
        });

        const metaData = challengesMetaDatas.find((c) => c.id.toString() === id.toString());
        if (!metaData) return;
        const res = challengeRes.result;
        if (!res || participantCount.error) return;

        const data = {
          verifier: res.verifier,
          targetNum: Number(res.minimumCheckIns),
          startTimestamp: Number(res.startTimestamp),
          joinDueTimestamp: Number(res.joinDueTimestamp),
          endTimestamp: Number(res.endTimestamp),
          donationDestination: res.donateDestination,
          participants: Number(participantCount.result.toString()),
          stake: res.stakePerUser,
          totalStaked: res.stakePerUser * participantCount.result,
          ...metaData,
        };

        setChallenge(data);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
      } finally {
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [publicClient, id, challengesMetaDatas, loadingMetaData]);

  return { loading, challenge, error };
};

export default useChallenge;
