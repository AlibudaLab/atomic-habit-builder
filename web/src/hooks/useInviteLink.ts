'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

function useInviteLink(challengeId: number, accessCode?: string) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = origin + `/habit/stake/${challengeId}${accessCode ? `?code=${accessCode}` : ''}`;

  const copyLink = useCallback(() => {
    void navigator.clipboard.writeText(link);
    toast.success('Copied to clipboard');
  }, [link]);

  return {
    link,
    copyLink,
  };
}

export default useInviteLink;
