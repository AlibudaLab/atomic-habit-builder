import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { usePublicClient } from 'wagmi';
import { Challenge } from '@/types';
import useChallengeMetaDatas from './useChallengeMetaData';

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
              address: trackerContract.address,
              abi: trackerContract.abi,
              functionName: 'challenges',
              args: [BigInt(id.toString())],
            }, {
              address: trackerContract.address,
              abi: trackerContract.abi,
              functionName: 'getChallengeParticipantsCount',
              args: [BigInt(id.toString())],
            }
          ]});

        console.log('participantCount', participantCount)

        const metaData = challengesMetaDatas.find((c) => c.id.toString() === id.toString());
        if (!metaData) return;
        const res = challengeRes.result
        if (!res || participantCount.error) return;

        const data = {
          verifier: res[0],
          targetNum: Number(res[1].toString()),
          startTimestamp: Number(res[2].toString()),
          joinDueTimestamp: Number(res[3].toString()),
          endTimestamp: Number(res[4].toString()),
          donationDestination: res[5],
          participants: Number(participantCount.result.toString()),
          stake: res[8],
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
