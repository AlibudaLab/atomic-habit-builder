import { ActivityTypes, VerificationType, challenges } from '@/constants';
import { readContract } from '@wagmi/core';
import trackerContract from '@/contracts/tracker.json';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

export type Challenge = {
  name: string;
  duration: string;
  arxAddress: string;
  stake: number;
  icon: string;
  donationOrg?: string;
  type: ActivityTypes;
  verificationType: VerificationType;
  mapKey?: string;
};

const useUserChallenges = (address: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Challenge[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        const userChallenges = await readContract(config, {
          abi: trackerContract.abi,
          address: trackerContract.address as `0x${string}`,
          functionName: 'getUserChallenges',
          args: [address],
        });

        // TODO: fetch user activities from rpc
        const userRegisteredAddresses = (userChallenges as string[]).map((a) => a.toLowerCase());

        // all challenges that user participants in
        const knownChallenges = challenges.filter((c) =>
          userRegisteredAddresses.includes(c.arxAddress.toLowerCase()),
        );

        setData(knownChallenges);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [address]);

  return { loading, data, error };
};

export default useUserChallenges;
