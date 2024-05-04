/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { useState, useEffect } from 'react';

export type Challenge = {
  name: string;
  duration: string;
  arxAddress: string;
  stake: number;
};

const useUserChallenges = (address: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Challenge[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  console.log('error', error);

  useEffect(() => {
    if (!address) return;
    const fetchData = async () => {
      try {
        // TODO: fetch user activities from rpc
        setLoading(true);

        setData([
          {
            name: '🧘🏻‍♂️ challenge',
            duration: 'May 6-8',
            arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
            stake: 0.001,
          },
        ]);

        setLoading(false);
      } catch (_error) {
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [address]);

  return { loading, data, error };
};

export default useUserChallenges;
