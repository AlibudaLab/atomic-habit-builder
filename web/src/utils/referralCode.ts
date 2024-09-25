export function generateUniqueCode(length = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function generateReferralCode(address: string): Promise<string | null> {
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
  }
  return null;
}

export async function fetchOrGenerateReferralCode(address: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/user/referral?address=${address}`);
    const data = await response.json();
    if (data.referralCode) {
      return data.referralCode;
    } else {
      // If no referral code exists, generate a new one
      return await generateReferralCode(address);
    }
  } catch (error) {
    console.error('Error fetching or generating referral code:', error);
    return null;
  }
}
