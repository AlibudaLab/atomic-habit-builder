import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

export function useReferralCode(address: string | undefined) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      fetchOrGenerateReferralCode();
    }
  }, [address]);

  const fetchOrGenerateReferralCode = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user/referral?address=${address}`);
      const data = await response.json();
      if (data.referralCode) {
        setReferralCode(data.referralCode);
      } else {
        // If no referral code exists, generate a new one
        const newCode = await generateReferralCode();
        setReferralCode(newCode);
      }
    } catch (error) {
      console.error('Error fetching or generating referral code:', error);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  const generateReferralCode = useCallback(async () => {
    if (!address) return null;
    try {
      const response = await fetch('/api/user/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();
      if (data.referralCode) {
        return data.referralCode;
      }
    } catch (error) {
      console.error('Error generating referral code:', error);
      toast.error('Failed to generate referral code');
    }
    return null;
  }, [address]);

  const getInviteLink = useCallback(() => {
    if (!referralCode) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}?ref=${referralCode}`;
  }, [referralCode]);

  const copyInviteLink = useCallback(() => {
    const link = getInviteLink();
    if (link) {
      navigator.clipboard.writeText(link);
      toast.success('Invite link copied to clipboard');
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
