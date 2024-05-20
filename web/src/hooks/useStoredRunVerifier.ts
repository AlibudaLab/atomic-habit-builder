import { useCallback, useEffect, useState } from 'react';

import { RunVerifier } from '@/types';

const STORAGE_KEY_VERIFIER = 'run-verifier';
const STORAGE_KEY_SECRET = 'run-verifier-secret';
const STORAGE_KEY_TIMESTAMP = 'run-verifier-timestamp';

const defaultVerifier = localStorage.getItem(STORAGE_KEY_VERIFIER)?? RunVerifier.None;
const defaultSecret = localStorage.getItem(STORAGE_KEY_SECRET)?? null;
const lastUpdate = Number(localStorage.getItem(STORAGE_KEY_TIMESTAMP))?? 0;

export const useRunVerifier = () => {
  
  const [verifier, setVerifier] = useState(defaultVerifier); // default theme

  // custom secret used by each verifier
  const [secret, setSecret] = useState<string | null>(defaultSecret);

  const [lastUpdated, setLastUpdated] = useState<number>(lastUpdate);

  const updateVerifierAndSecret = useCallback((newVerifier: RunVerifier, newSecret: string) => {
    setVerifier(newVerifier);
    localStorage.setItem(STORAGE_KEY_VERIFIER, newVerifier);

    setSecret(newSecret);
    localStorage.setItem(STORAGE_KEY_SECRET, newSecret);

    const timestamp = Date.now() / 1000;
    localStorage.setItem(STORAGE_KEY_TIMESTAMP, timestamp.toString());
    setLastUpdated(timestamp);

  }, [setVerifier, setSecret, setLastUpdated])

  return { verifier, secret, updateVerifierAndSecret, lastUpdated };
};
