const REFERRAL_CODE_KEY = 'atomicHabitsReferralCode';

export const storeReferralCode = (code: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(REFERRAL_CODE_KEY, code);
  }
};

export const getReferralCode = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(REFERRAL_CODE_KEY);
  }
  return null;
};

export const clearReferralCode = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(REFERRAL_CODE_KEY);
  }
};
