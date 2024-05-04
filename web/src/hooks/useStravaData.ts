import { ActivityTypes, VerificationType, challenges } from '@/constants';
import { readContract } from '@wagmi/core';
import trackerContract from '@/contracts/tracker.json';
import { useState, useEffect } from 'react';
import { wagmiConfig as config } from '@/OnchainProviders';

type StravaActiviry = {
  distance: number;
  max_heartrate: number
  moving_time: number
  name: string
  timestamp: string
  id: number
}

const useStravaData = (accessToken: string | null | undefined) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StravaActiviry[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    const fetchData = async () => {
      try {
        setLoading(true);

        // request
        const fetchURL =
          '/api/strava/activities?' +
          new URLSearchParams({
            accessToken: accessToken
          }).toString();
        console.log(fetchURL);
        
        const response = await (
          await fetch(fetchURL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        ).json() as {runData: StravaActiviry[]};

        setData(response.runData)

        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [accessToken]);

  return { loading, data, error };
};

export default useStravaData;
