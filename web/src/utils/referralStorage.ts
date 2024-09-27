import storage from 'local-storage-fallback';

const REFERRAL_CODE_KEY = 'atomicHabitsReferralCode';

export const storeReferralCode = (code: string) => {
  storage.setItem(REFERRAL_CODE_KEY, code);
};

export const getReferralCode = (): string | null => {
  return storage.getItem(REFERRAL_CODE_KEY);
};

export function generateUniqueCode(length = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
