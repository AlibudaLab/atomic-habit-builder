'use client';

import { useRunVerifier } from '@/hooks/useStoredRunVerifier';
import Header from '../../habit/components/Header';
import { RunVerifier } from '@/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import * as stravaUtils from '@/utils/strava';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';

const StravaImg = require('@/imgs/apps/strava.png') as string;

/**
 * This page is only used to receive the strava login callback
 * @returns
 */
export default function CallbackStrava() {
  const searchParams = useSearchParams();

  const stravaAuthToken = searchParams.get('code');

  const originalUri = searchParams.get('state');

  const { updateVerifierAndSecret } = useRunVerifier();

  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();

  // Upon receiving the ath token, try get the access token!
  useEffect(() => {
    const updateAccessTokenAndRefreshToken = async () => {
      setIsPending(true);
      console.log('update access token and refresh token');

      if (!stravaAuthToken) {
        return; // No need to proceed if token is absent
      }

      // use our backend to use authToken to get access token and refresh token
      // need to proxy through our backend because it requires a App secret
      try {
        const { refreshToken, accessToken, expiry } =
          await stravaUtils.getAccessAndRefreshToken(stravaAuthToken);

        if (!accessToken || !refreshToken) {
          toast.error('Failed to connect with Strava');
        }

        const newSecret = stravaUtils.joinSecret(accessToken, refreshToken);

        updateVerifierAndSecret(RunVerifier.Strava, newSecret, expiry);

        toast('Successfully connected with Strava', { icon: '🚀' });

        // Redirect to the original page
        if (originalUri) router.push(originalUri).catch((e) => console.log(e));
      } finally {
        setIsPending(false); // Always set loading state to false after the operation
      }
    };

    updateAccessTokenAndRefreshToken().catch(console.log);
  }, [stravaAuthToken, updateVerifierAndSecret, originalUri]);

  return (
    <main className="flex flex-col items-center">
      {stravaAuthToken !== undefined && (
        <>
          {isPending ? (
            <div className="py-4 text-lg font-bold"> Connecting Strava with Alibuda ... </div>
          ) : (
            <div className="py-4 text-lg font-bold"> Connected with Strava! </div>
          )}
          <Image src={StravaImg} height={55} width={55} alt="Strava" />
        </>
      )}
    </main>
  );
}
