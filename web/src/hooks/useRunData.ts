import { useState, useEffect } from 'react';
import { useRunVerifier } from './useStoredRunVerifier';
import { RunVerifier } from '@/types';
import * as stravaUtils from '@/utils/strava';

const useRunData = () => {
  const { verifier, secret } = useRunVerifier()
  
  const [loading, setLoading] = useState(true);

  // TODO: change to more generic type
  const [data, setData] = useState<StravaActiviry[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  

  useEffect(() => {

    // TODO: add others verifiers
    if (verifier !== RunVerifier.Strava) {
      return;
    }
    if (!secret) return;

    
    const fetchData = async () => {
      const { accessToken } = stravaUtils.splitSecret(secret)
  
      try {
        const newData = await stravaUtils.fetchActivitis(accessToken);
        setData(newData)
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [secret, verifier]);

  return { loading, data, error };
};

export default useRunData;
