import { readContract } from '@wagmi/core';
import { abi } from '@/abis/challenge';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';
import { UserStatus } from '@/types';
import { challengeAddr } from '@/constants';

const useUserJoined = (address: string | undefined, challengeId: bigint) => {
  const [loading, setLoading] = useState(true);
  const [joined, setJoined] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!address) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const status = await readContract(config, {
          abi: abi,
          address: challengeAddr,
          functionName: 'userStatus',
          args: [challengeId, address as `0x${string}`],
        });
        setJoined(status >= UserStatus.Joined);
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
