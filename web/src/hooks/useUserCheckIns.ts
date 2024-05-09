import { readContract } from '@wagmi/core';
import trackerContract from '@/contracts/tracker.json';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

const useUserChallengeCheckIns = (address: string | undefined, challengesAddr: string) => {
  const [loading, setLoading] = useState(true);
  const [checkedIn, setCheckedIn] = useState<number>(0);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const achieved = (await readContract(config, {
          abi: trackerContract.abi,
          address: trackerContract.address as `0x${string}`,
          functionName: 'getUserCheckInCounts',
          args: [challengesAddr, address],
        })) as bigint;

        const checked = Number(achieved.toString());
        setCheckedIn(checked);

        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);

    setInterval(fetchData, 5000);
  }, [address, challengesAddr]);

  return { loading, checkedIn, error };
};

export default useUserChallengeCheckIns;
