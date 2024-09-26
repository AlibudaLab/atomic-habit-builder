'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRunVerifier } from './useStoredRunVerifier';
import { Challenge, RunVerifier } from '@/types';
import * as stravaUtils from '@/utils/strava';

const useStravaData = (challenge: Challenge) => {
  const { verifier, secret, expiry, updateVerifierAndSecret } = useRunVerifier();

  const [loading, setLoading] = useState(true);
  const [runData, setRunData] = useState<stravaUtils.StravaRunData[]>([]);
  // TODO: move this to a separate hook when we have more sources for workout data / run data
  const [workoutData, setWorkoutData] = useState<stravaUtils.StravaWorkoutData[]>([]);
  const [cyclingData, setCyclingData] = useState<stravaUtils.StravaCyclingData[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  const connected = verifier !== RunVerifier.None;
  const expired = useMemo(() => Date.now() / 1000 > expiry, [expiry]);

  const handleError = (message: string) => {
    setError(message);
    setLoading(false);
  };

  const fetchData = useCallback(
    async (accessToken: string) => {
      try {
        const [newRunData, newWorkoutData, newCyclingData] = await Promise.all([
          stravaUtils.fetchActivities(
            accessToken,
            'run',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ) as Promise<stravaUtils.StravaRunData[]>,
          stravaUtils.fetchActivities(
            accessToken,
            'workout',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ) as Promise<stravaUtils.StravaWorkoutData[]>,
          stravaUtils.fetchActivities(
            accessToken,
            'cycling',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ) as Promise<stravaUtils.StravaCyclingData[]>,
        ]);

        if (!newRunData || !newWorkoutData || !newCyclingData) {
          handleError('No data found');
          return;
        }

        setRunData(
          newRunData.filter(
            (activity) =>
              (challenge.minDistance === undefined || activity.distance >= challenge.minDistance) &&
              (challenge.minTime === undefined || activity.moving_time >= challenge.minTime),
          ),
        );

        setWorkoutData(
          newWorkoutData.filter(
            (activity) =>
              challenge.minTime === undefined || activity.moving_time >= challenge.minTime,
          ),
        );

        setCyclingData(
          newCyclingData.filter(
            (activity) =>
              (challenge.minDistance === undefined || activity.distance >= challenge.minDistance) &&
              (challenge.minTime === undefined || activity.moving_time >= challenge.minTime),
          ),
        );

        setLoading(false);
      } catch (_error) {
        console.log('error', _error);
        handleError(_error as string);
      }
    },
    [challenge],
  );

  useEffect(() => {
    console.log('Updating access token!');
    if (!expired || verifier !== RunVerifier.Strava) return;

    const updateAccessToken = async () => {
      if (!secret) {
        handleError('No secret');
        return;
      }

      const { refreshToken } = stravaUtils.splitSecret(secret);
      const { accessToken: newAccessToken, expiry: newExpiry } =
        await stravaUtils.refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        handleError('Failed to refresh access token');
        return;
      }

      const newSecret = stravaUtils.joinSecret(newAccessToken, refreshToken);
      updateVerifierAndSecret(RunVerifier.Strava, newSecret, newExpiry);
    };

    updateAccessToken().catch(console.error);
  }, [secret, updateVerifierAndSecret, verifier, expired]);

  useEffect(() => {
    if (verifier !== RunVerifier.Strava || expired || !secret) return;

    setLoading(true);
    const { accessToken } = stravaUtils.splitSecret(secret);
    fetchData(accessToken).catch(setError);
  }, [secret, verifier, expired, challenge, fetchData]);

  return { loading, runData, workoutData, cyclingData, error, connected };
};

export default useStravaData;
