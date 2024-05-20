/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import { useRunVerifier } from '@/hooks/useStoredRunVerifier';
import Header from '../habit/components/Header';
import { RunVerifier } from '@/types';
import Image from 'next/image';

import * as stravaUtils from '@/utils/strava';
import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

const StravaImg = require('@/imgs/apps/strava.png') as string;
const NRCImg = require('@/imgs/apps/nrc.png') as string;

export default function ConnectRunDataSource() {
  const { verifier, updateVerifierAndSecret } = useRunVerifier();

  // if url contains 'original_uri', then pass this info to the strava callback page, so after connecting we can go back
  const searchParams = useSearchParams();
  const originalUri = searchParams.get('original_uri');

  const onClickStrava = useCallback(() => {
    const authUrl = stravaUtils.getAuthURL(window.location.href + '/strava', originalUri)
    window.location = authUrl as any;
  }, []);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="font-bold text-lg py-4">Link Run Data Source</div>
      <div>
        {/* {verifier === RunVerifier.None && ( */}
          <div className="flex gap-4">
            {/* connect with strava */}
            <button type='button' className='flex bg-white rounded-md hover:scale-105 transition-transform justify-center items-center' onClick={onClickStrava}>
              <div className='p-4 bg-white rounded-md'>
                Connect Strava
              </div>
              <Image src={StravaImg} height={55} width={55} alt="Strava" />
            </button>

            {/* connect with NRC */}
            <button type='button' className='flex bg-white rounded-md hover:scale-105 transition-transform justify-center items-center' onClick={() => updateVerifierAndSecret(RunVerifier.Strava, '')}>
              <div className='p-4 bg-white rounded-md'>
                Connect NRC
              </div>
              <Image src={NRCImg} height={55} width={55} alt="NRC" />
            </button>
          </div>
        {/* )} */}
      </div>
    </main>
  );
}
