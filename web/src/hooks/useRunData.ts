import { useState, useEffect } from 'react';
import { useRunVerifier } from './useStoredRunVerifier';
import { RunVerifier } from '@/types';
import * as stravaUtils from '@/utils/strava';
import { StravaActivity } from '@/utils/strava';

const useRunData = () => {
  const { verifier, secret, expiry, updateVerifierAndSecret } = useRunVerifier();

  const [loading, setLoading] = useState(true);

  // TODO: change to more generic type
  const [data, setData] = useState<StravaActivity[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const connected = verifier !== RunVerifier.None;

  useEffect(() => {
    // TODO: add others verifiers
    if (verifier !== RunVerifier.Strava) {
      return;
    }
    console.log('secret', secret);
    if (!secret) return;

    // not expired, do nothing
    if (expiry > Date.now() / 1000) return;

    const updateAccessToken = async () => {
      console.log('Updating access token!');
      // expired, wait for refresh and expiry to update
      const { refreshToken } = stravaUtils.splitSecret(secret);

      const { accessToken: newAccessToken, expiry: newExpiry } =
        await stravaUtils.refreshAccessToken(refreshToken);

      console.log('newAccessToken', newAccessToken)

      const newSecret = stravaUtils.joinSecret(newAccessToken, refreshToken);
      // update secret
      updateVerifierAndSecret(RunVerifier.Strava, newSecret, newExpiry);
    };

    updateAccessToken().catch(console.error);
  }, [expiry, secret, updateVerifierAndSecret, verifier]);

  console.log('expiry', expiry);

  // fetch data when access token are updated and not expired!
  useEffect(() => {
    // TODO: add others verifiers
    if (verifier !== RunVerifier.Strava) {
      return;
    }
    if (!secret) return;
    if (expiry < Date.now() / 1000) {
      console.log('waiting for refresh');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      const { accessToken } = stravaUtils.splitSecret(secret);

      try {
        const newData = await stravaUtils.fetchActivities(accessToken);
        setData(newData);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [secret, verifier, updateVerifierAndSecret, expiry]);

  return { loading, data, error, connected };
};

export default useRunData;
