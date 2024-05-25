'use client';

import { use, useCallback, useEffect, useState } from 'react';

import storage from 'local-storage-fallback';

const STORAGE_KEY_ACTIVITY = 'strava-activity-used';

// TEMP: store this in browser
const useUsedActivity = () => {
  const [activities, setActivities] = useState<string[]>([]);

  // when first loaded, try getting from local storage
  useEffect(() => {
    if (!window) return;
    const stored = storage.getItem(STORAGE_KEY_ACTIVITY) ?? '[]';
    setActivities(JSON.parse(stored));
  }, []);

  const updateUsedActivities = useCallback(
    (newId: string) => {
      const newActivities = [...activities, newId];
      setActivities(newActivities);
      storage.setItem(STORAGE_KEY_ACTIVITY, JSON.stringify(newActivities));
    },
    [setActivities],
  );

  return { activities, updateUsedActivities };
};

export default useUsedActivity;
