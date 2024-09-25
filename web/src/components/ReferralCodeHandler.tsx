'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { storeReferralCode } from '@/utils/referralStorage';

export default function ReferralCodeHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      storeReferralCode(ref);
    }
  }, [searchParams]);

  return null; // This component doesn't render anything
}
