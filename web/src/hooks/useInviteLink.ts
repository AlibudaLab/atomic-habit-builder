'use client';

import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { fetchOrGenerateReferralCode } from '@/utils/referralCode';

function useInviteLink(challengeId?: number, accessCode?: string) {
  const { address } = usePasskeyAccount();
  const [origin, setOrigin] = useState('');
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (address) {
      void fetchAndSetReferralCode();
    }
  }, [address]);

  const fetchAndSetReferralCode = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    const code = await fetchOrGenerateReferralCode(address);
    setReferralCode(code);
    setIsLoading(false);
  }, [address]);

  const getInviteLink = useCallback(() => {
    if (!referralCode) return '';

    let link = `${origin}`;

    if (challengeId) {
      link += `/habit/stake/${challengeId}`;
      if (accessCode) {
        link += `?code=${accessCode}`;
      }
      link += `${accessCode ? '&' : '?'}ref=${referralCode}`;
    } else {
      link += `?ref=${referralCode}`;
    }

    return link;
  }, [origin, referralCode, challengeId, accessCode]);

  const copyInviteLink = useCallback(() => {
    const link = getInviteLink();
    if (link) {
      navigator.clipboard
        .writeText(link)
        .then(() => {
          toast.success('Invite link copied to clipboard');
        })
        .catch((error) => {
          console.error('Error copying invite link:', error);
          toast.error('Failed to copy invite link');
        });
    } else {
      toast.error('Unable to generate invite link');
    }
  }, [getInviteLink]);

  return {
    referralCode,
    isLoading,
    getInviteLink,
    copyInviteLink,
  };
}

export default useInviteLink;
