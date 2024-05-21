/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import { useRunVerifier } from '@/hooks/useStoredRunVerifier';
import Header from '../../habit/components/Header';
import { RunVerifier } from '@/types';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import * as stravaUtils from '@/utils/strava';
import toast from 'react-hot-toast';
import Link from 'next/link';

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
        if (originalUri) window.location.href = originalUri;
      } finally {
        setIsPending(false); // Always set loading state to false after the operation
      }
    };

    updateAccessTokenAndRefreshToken().catch(console.log);
  }, [stravaAuthToken, updateVerifierAndSecret, originalUri]);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      {stravaAuthToken !== undefined && (
        <>
          {isPending ? (
            <div className="py-4 text-lg font-bold"> Connecting Strava with Alibuda ... </div>
          ) : (
            <div className="py-4 text-lg font-bold"> Connected with Strava! </div>
          )}
          <Image src={StravaImg} height={55} width={55} alt="Strava" />

          {!isPending && (
            <Link
              href="/habit"
              className="bg-yellow m-4 rounded-md p-4 font-bold text-white no-underline"
            >
              See Challenges
            </Link>
          )}
        </>
      )}
    </main>
  );
}
