'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRunVerifier } from './useStoredRunVerifier';
import { Challenge, RunVerifier } from '@/types';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';

const useStravaData = (challenge: Challenge) => {
  const { verifier, secret, expiry, updateVerifierAndSecret } = useRunVerifier();

  const [loading, setLoading] = useState(true);
  const [runData, setRunData] = useState<stravaUtils.StravaRunData[]>([]);
  const [workoutData, setWorkoutData] = useState<stravaUtils.StravaWorkoutData[]>([]);
  const [cyclingData, setCyclingData] = useState<stravaUtils.StravaCyclingData[]>([]);
  const [swimData, setSwimData] = useState<stravaUtils.StravaSwimData[]>([]);
  const [error, setError] = useState<unknown | null>(null);

  console.log('runData', runData);

  const connected = verifier !== RunVerifier.None;
  const expired = useMemo(() => Date.now() / 1000 > expiry, [expiry]);

  useEffect(() => {
    if (!expired || verifier !== RunVerifier.Strava) return;

    const updateAccessToken = async () => {
      if (!secret) {
        setError('No secret');
        return;
      }

      const { refreshToken } = stravaUtils.splitSecret(secret);
      const { accessToken: newAccessToken, expiry: newExpiry } =
        await stravaUtils.refreshAccessToken(refreshToken);

      if (!newAccessToken) {
        setError('Failed to refresh access token');
        return;
      }

      const newSecret = stravaUtils.joinSecret(newAccessToken, refreshToken);
      updateVerifierAndSecret(RunVerifier.Strava, newSecret, newExpiry);
    };

    updateAccessToken().catch((err) => {
      console.error('Error updating access token:', err);
      setError(err);
    });
  }, [secret, updateVerifierAndSecret, verifier, expired]);

  useEffect(() => {
    if (verifier !== RunVerifier.Strava || expired || !secret) return;

    setLoading(true);
    const { accessToken } = stravaUtils.splitSecret(secret);

    const fetchData = async () => {
      try {
        const [newRunData, newWorkoutData, newCyclingData, newSwimData] = await Promise.all([
          stravaUtils.fetchActivities(
            accessToken,
            'run',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ),
          stravaUtils.fetchActivities(
            accessToken,
            'workout',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ),
          stravaUtils.fetchActivities(
            accessToken,
            'cycling',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ),
          stravaUtils.fetchActivities(
            accessToken,
            'swim',
            challenge.startTimestamp,
            challenge.endTimestamp,
          ),
        ]);

        console.log('newRunData', newRunData);

        setRunData(
          newRunData.filter(
            (activity): activity is stravaUtils.StravaRunData =>
              'distance' in activity &&
              (challenge.minDistance === undefined || activity.distance >= challenge.minDistance) &&
              (challenge.minTime === undefined || activity.moving_time >= challenge.minTime),
          ),
        );
        setWorkoutData(
          newWorkoutData.filter(
            (activity): activity is stravaUtils.StravaWorkoutData =>
              challenge.minTime === undefined || activity.moving_time >= challenge.minTime,
          ),
        );
        setCyclingData(
          newCyclingData.filter(
            (activity): activity is stravaUtils.StravaCyclingData =>
              'distance' in activity &&
              (challenge.minDistance === undefined || activity.distance >= challenge.minDistance) &&
              (challenge.minTime === undefined || activity.moving_time >= challenge.minTime),
          ),
        );
        setSwimData(
          newSwimData.filter(
            (activity): activity is stravaUtils.StravaSwimData =>
              'distance' in activity &&
              (challenge.minDistance === undefined || activity.distance >= challenge.minDistance) &&
              (challenge.minTime === undefined || activity.moving_time >= challenge.minTime),
          ),
        );

        setLoading(false);
      } catch (err) {
        console.error('Error fetching Strava data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData().catch((err) => {
      console.error('Error in fetchData:', err);
      setError(err);
      setLoading(false);
    });
  }, [secret, verifier, expired, challenge]);

  return { loading, runData, workoutData, cyclingData, swimData, error, connected };
};

export default useStravaData;
