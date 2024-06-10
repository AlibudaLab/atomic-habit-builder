import { readContract } from '@wagmi/core';
import * as trackerContract from '@/contracts/tracker';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

const useUserJoined = (address: string | undefined, challengeId: bigint) => {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const hasJoined = await readContract(config, {
          abi: trackerContract.abi,
          address: trackerContract.address,
          functionName: 'hasJoined',
          args: [challengeId, address as `0x${string}`],
        });
        setJoined(hasJoined);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);

    setInterval(fetchData, 5000);
  }, [address, challengeId]);

  return { loading, joined, error };
};

export default useUserJoined;
