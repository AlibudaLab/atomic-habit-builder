'use client';

import { ActivityMap } from '@/types';
import { useState, useEffect } from 'react';
import { Address } from 'viem';

const useActivityUsage = (user: Address | undefined) => {
  const [activityMap, setActivityMap] = useState<ActivityMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('activityMap', activityMap);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchChallenges = async () => {
      try {
        const response = await fetch(`/api/user?$address${user}`);
        const data = await response.json();
        setActivityMap(data.activityMap as ActivityMap);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges().then(console.log).catch(console.error);
  }, []);

  const addToActivityMap = (challengeId: number, activityId: string) => {
    setActivityMap((prev) => {
      const prevActivities = prev[challengeId] || [];
      return {
        ...prev,
        [challengeId]: [...prevActivities, activityId],
      };
    });

    fetch('/api/user/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user,
        challengeId,
        activityId,
      }),
    })
      .then((res) => {
        console.log('api response', res);
      })
      .catch((error) => {
        console.error('Error adding activity:', error);
      });
  };

  return { activityMap, addToActivityMap, loading, error };
};

export default useActivityUsage;
