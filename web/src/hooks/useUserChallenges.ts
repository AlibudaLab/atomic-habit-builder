import { ActivityTypes, VerificationType, challenges } from '@/constants';
import { useState, useEffect } from 'react';

export type Challenge = {
  name: string;
  duration: string;
  arxAddress: string;
  stake: number;
  icon: string;
  donationOrg?: string,
  type: ActivityTypes,
  verificationType: VerificationType,
  mapKey?:string
};

const useUserChallenges = (address: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Challenge[] | []>([]);
  const [error, setError] = useState<unknown | null>(null);

  console.log('error', error);

  useEffect(() => {
    if (!address) return;
    const fetchData = async () => {
      try {
        
        setLoading(true);

        // TODO: fetch user activities from rpc
        const userRegisteredAddresses = [
          '0x1234567890abcdef1234567890abcdef12345678'
        ].map(a => a.toLowerCase())

        // all challenges that user participants in
        const knownChallenges = challenges.filter(c => userRegisteredAddresses.includes(c.arxAddress.toLowerCase()))

        setData(knownChallenges);

        setLoading(false);
      } catch (_error) {
        setError(_error);
        setLoading(false);
      }
    };

    fetchData().catch(console.error);
  }, [address]);

  return { loading, data, error };
};

export default useUserChallenges;
