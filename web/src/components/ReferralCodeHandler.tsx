'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import storage from 'local-storage-fallback';

const REFERRAL_CODE_KEY = 'atomicHabitsReferralCode';

/**
 * Use to store referral code from others in localstorage 
 * @returns 
 */
export function useStoredReferralCode() {
  const searchParams = useSearchParams();
  const [referralCode, setReferralCode] = useState<string | null>(null);

  useEffect(() => {
    const storedCode = storage.getItem(REFERRAL_CODE_KEY);
    if (storedCode) {
      setReferralCode(storedCode);
    }
  }, []);

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      storage.setItem(REFERRAL_CODE_KEY, ref);
      setReferralCode(ref);
    }
  }, [searchParams]);

  const storeReferralCode = (code: string) => {
    storage.setItem(REFERRAL_CODE_KEY, code);
    setReferralCode(code);
  };

  const clearReferralCode = () => {
    storage.removeItem(REFERRAL_CODE_KEY);
    setReferralCode(null);
  };

  return {
    referralCode,
    storeReferralCode,
    clearReferralCode,
  };
}

export default function ReferralCodeHandler() {
  useStoredReferralCode();
  return null; // This component doesn't render anything
}
