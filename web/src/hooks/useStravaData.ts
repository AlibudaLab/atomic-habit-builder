'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRunVerifier } from './useStoredRunVerifier';
import { Challenge, RunVerifier } from '@/types';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';

const useStravaData = (challenge: Challenge) => {
  const { verifier, secret, expiry, updateVerifierAndSecret } = useRunVerifier();

  const [loading, setLoading] = useState(true);
  const [allActivities, setAllActivities] = useState<stravaUtils.StravaData[]>([]);
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
        const activities = await stravaUtils.fetchActivities(
          accessToken,
          'all',
          challenge.startTimestamp,
          challenge.endTimestamp,
        );

        if (!activities) {
          handleError('No data found');
          return;
        }

        const filteredActivities = activities.filter((activity) => {
          const category = stravaUtils.categorizeActivity(activity);
          if (category !== challenge.type.toLowerCase()) return false;

          switch (challenge.type) {
            case ChallengeTypes.Run:
            case ChallengeTypes.Cycling:
            case ChallengeTypes.Swim:
              return (
                (challenge.minDistance === undefined || 
                 ('distance' in activity && activity.distance >= challenge.minDistance)) &&
                (challenge.minTime === undefined || activity.moving_time >= challenge.minTime)
              );
            case ChallengeTypes.Workout:
              return challenge.minTime === undefined || activity.moving_time >= challenge.minTime;
            default:
              return true;
          }
        });

        setAllActivities(filteredActivities);
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

  const categorizedActivities = useMemo(() => {
    const runData: stravaUtils.StravaRunData[] = [];
    const workoutData: stravaUtils.StravaWorkoutData[] = [];
    const cyclingData: stravaUtils.StravaCyclingData[] = [];
    const swimData: stravaUtils.StravaSwimData[] = [];

    allActivities.forEach((activity) => {
      const category = stravaUtils.categorizeActivity(activity);
      switch (category) {
        case 'run':
          runData.push(activity as stravaUtils.StravaRunData);
          break;
        case 'workout':
          workoutData.push(activity as stravaUtils.StravaWorkoutData);
          break;
        case 'cycling':
          cyclingData.push(activity as stravaUtils.StravaCyclingData);
          break;
        case 'swim':
          swimData.push(activity as stravaUtils.StravaSwimData);
          break;
      }
    });

    return { runData, workoutData, cyclingData, swimData };
  }, [allActivities]);

  console.log(categorizedActivities.swimData)

  return { loading, ...categorizedActivities, error, connected };
};

export default useStravaData;
