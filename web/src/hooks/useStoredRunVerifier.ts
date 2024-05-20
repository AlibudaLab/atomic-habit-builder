import { useCallback, useEffect, useState } from 'react';

import { RunVerifier } from '@/types';

const STORAGE_KEY_VERIFIER = 'run-verifier';
const STORAGE_KEY_SECRET = 'run-verifier-secret';
const STORAGE_KEY_EXPIRY = 'run-verifier-expiry';

const storedVerifier = localStorage.getItem(STORAGE_KEY_VERIFIER) ?? RunVerifier.None;
const storedSecret = localStorage.getItem(STORAGE_KEY_SECRET) ?? null;
const storedExpiry = Number(localStorage.getItem(STORAGE_KEY_EXPIRY)) ?? 0;

export const useRunVerifier = () => {
  const [verifier, setVerifier] = useState(storedVerifier); // default theme

  // custom secret used by each verifier
  const [secret, setSecret] = useState<string | null>(storedSecret);

  const [expiry, setExpiry] = useState<number>(storedExpiry);

  const updateVerifierAndSecret = useCallback(
    (newVerifier: RunVerifier, newSecret: string, newExpiry?: number) => {
      setVerifier(newVerifier);
      localStorage.setItem(STORAGE_KEY_VERIFIER, newVerifier);

      setSecret(newSecret);
      localStorage.setItem(STORAGE_KEY_SECRET, newSecret);

      if (newExpiry) {
        setExpiry(newExpiry);
        localStorage.setItem(STORAGE_KEY_EXPIRY, newExpiry.toString());
      }
    },
    [setVerifier, setSecret, setExpiry],
  );

  return { verifier, secret, updateVerifierAndSecret, expiry };
};
