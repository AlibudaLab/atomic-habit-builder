import { readContract } from '@wagmi/core';
import { parseAbi } from 'viem';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

const useERC20Allowance = (
  owner: string | undefined,
  sender: string | undefined,
  token: string | undefined,
) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<bigint>(BigInt(0));
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!owner || !sender || !token) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        const allowance = await readContract(config, {
          abi: parseAbi([
            'function allowance(address owner, address spender) view returns (uint256)',
          ]),
          address: token as `0x${string}`,
          functionName: 'allowance',
          args: [owner as `0x${string}`, sender as `0x${string}`],
        });
        setData(allowance);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [owner, sender, token]);

  return { loading, data, error };
};

export default useERC20Allowance;
