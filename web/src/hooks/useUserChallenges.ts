import { ActivityTypes, VerificationType } from '@/constants';
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
        // TODO: fetch user activities from rpc
        setLoading(true);

        setData([
          {
            name: 'Run at Sydney Park 10 times',
            duration: 'May 6-8',
            arxAddress: '0x1234567890abcdef1234567890abcdef12345678',
            stake: 0.001,
            icon: '🏃🏻‍♂️',
            donationOrg: 'Gitcoin',
            verificationType: VerificationType.NFC,
            type: ActivityTypes.Physical,
            mapKey: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d13244.864971609879!2d151.1851663!3d-33.9098337!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12b04b8d42ec9f%3A0x2f847bc8689ddf4e!2sSydney%20Park!5e0!3m2!1sen!2sau!4v1714806603540!5m2!1sen!2sau'
          },
        ]);

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
