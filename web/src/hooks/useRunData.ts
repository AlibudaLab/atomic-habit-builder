'use client';

import { useState, useEffect, useMemo } from 'react';
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

  const expired = useMemo(() => Date.now() / 1000 > expiry, [expiry]);

  // update access token when expired
  useEffect(() => {
    // access token not expired, do nothing
    if (!expired) return;

    if (verifier !== RunVerifier.Strava) {
      return;
    }

    const updateAccessToken = async () => {
      console.log('Updating access token!');
      // error: cannot update access token without refresh token
      if (!secret) {
        setError('No secret');
        return;
      }
      // expired, wait for refresh and expiry to update
      const { refreshToken } = stravaUtils.splitSecret(secret);

      const { accessToken: newAccessToken, expiry: newExpiry } =
        await stravaUtils.refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        setError('Failed to refresh access token');
        return;
      }

      const newSecret = stravaUtils.joinSecret(newAccessToken, refreshToken);

      // update secret
      updateVerifierAndSecret(RunVerifier.Strava, newSecret, newExpiry);
    };

    updateAccessToken().catch(console.error);
  }, [secret, updateVerifierAndSecret, verifier, expired]);

  // fetch data when access token are updated and not expired
  useEffect(() => {
    // TODO: add others verifiers
    if (verifier !== RunVerifier.Strava) {
      return;
    }
    if (expired) return;

    const fetchData = async () => {
      console.log('fetching strava run data');
      if (!secret) {
        setError('No secret');
        return;
      }

      setLoading(true);
      const { accessToken } = stravaUtils.splitSecret(secret);
      console.log('using accessToken', accessToken);
      try {
        const newData = await stravaUtils.fetchActivities(accessToken);
        if (!newData) {
          setError('No data found');
          return;
        }

        setData(newData);
        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(setError);
  }, [secret, verifier, updateVerifierAndSecret, expired]);

  return { loading, data, error, connected };
};

export default useRunData;
