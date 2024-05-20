'use client';

import { useCallback, useEffect, useState } from 'react';

import { RunVerifier } from '@/types';
import storage from 'local-storage-fallback'

const STORAGE_KEY_VERIFIER = 'run-verifier';
const STORAGE_KEY_SECRET = 'run-verifier-secret';
const STORAGE_KEY_EXPIRY = 'run-verifier-expiry';

export const useRunVerifier = () => {
  // whether it's Strava, Nike Run Club or Apple
  const [verifier, setVerifier] = useState(RunVerifier.None);
  // custom secret used by each verifier
  const [secret, setSecret] = useState<string | null>(null);
  const [expiry, setExpiry] = useState<number>(0);

  // when first loaded, try getting from local storage
  useEffect(() => {
    if (!window) return;

    const storedVerifier =
      (storage.getItem(STORAGE_KEY_VERIFIER) as RunVerifier) ?? RunVerifier.None;
    const storedSecret = storage.getItem(STORAGE_KEY_SECRET) ?? null;
    const storedExpiry = Number(storage.getItem(STORAGE_KEY_EXPIRY)) ?? 0;

    setVerifier(storedVerifier);
    setSecret(storedSecret);
    setExpiry(storedExpiry);
  }, []);

  const updateVerifierAndSecret = useCallback(
    (newVerifier: RunVerifier, newSecret: string, newExpiry?: number) => {
      setVerifier(newVerifier);
      storage.setItem(STORAGE_KEY_VERIFIER, newVerifier);

      setSecret(newSecret);
      storage.setItem(STORAGE_KEY_SECRET, newSecret);

      if (newExpiry) {
        setExpiry(newExpiry);
        storage.setItem(STORAGE_KEY_EXPIRY, newExpiry.toString());
      }
    },
    [setVerifier, setSecret, setExpiry],
  );

  return { verifier, secret, updateVerifierAndSecret, expiry };
};
