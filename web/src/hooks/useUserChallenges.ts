import { ChallengeTypes, challenges } from '@/constants';
import { readContract } from '@wagmi/core';
import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

export type Challenge = {
  name: string;
  duration: string;
  arxAddress: string;
  stake: number;
  donationOrg?: string;
  type: ChallengeTypes;
  mapKey?: string;
  targetNum: number;
  checkedIn?: number;
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
          args: [address as `0x${string}`],
        });

        // fetch user activities from rpc
        const userRegisteredAddresses = (userChallenges as string[]).map((a) => a.toLowerCase());

        // all challenges that user participants in
        let knownChallenges = challenges.filter((c) =>
          userRegisteredAddresses.includes(c.arxAddress.toLowerCase()),
        );

        await Promise.all(
          knownChallenges.map(async (c) => {
            const checkedIn = (await readContract(config, {
              abi: trackerContract.abi,
              address: trackerContract.address as `0x${string}`,
              functionName: 'getUserCheckInCounts',
              args: [c.arxAddress as `0x${string}`, address as `0x${string}`],
            })) as unknown as number;
            knownChallenges = knownChallenges.map((k) =>
              k.arxAddress.toLowerCase() === c.arxAddress.toLowerCase() ? { ...k, checkedIn } : k,
            );
          }),
        );

        console.log(knownChallenges);

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
