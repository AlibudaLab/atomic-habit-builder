/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import Header from '../habit/components/Header';
import Image from 'next/image';

import * as stravaUtils from '@/utils/strava';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';

const StravaImg = require('../../src/imgs/apps/strava.png') as string;
const NRCImg = require('../../src/imgs/apps/nike-run.png') as string;

export default function ConnectRunDataSource() {
  // if url contains 'original_path', then pass this info to the strava callback page, so after connecting we can go back
  const searchParams = useSearchParams();
  const originalPath = searchParams.get('original_path');

  const pathName = usePathname();

  console.log('originalUri', originalPath);

  const onClickStrava = useCallback(() => {
    const redirectUri = window.origin + pathName + '/strava';
    const authUrl = stravaUtils.getAuthURL(redirectUri, originalPath);
    window.location = authUrl as any;
  }, []);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="py-4 text-lg font-bold">Link Run Data Source</div>
      <div>
        {/* {verifier === RunVerifier.None && ( */}
        <div className="gap-2 sm:flex">
          {/* connect with strava */}
          <button
            type="button"
            className="my-2 flex min-w-[250px] items-center justify-center rounded-md bg-white p-2 transition-transform hover:scale-105"
            onClick={onClickStrava}
          >
            <div className="rounded-md bg-white p-4">Strava</div>
            <Image src={StravaImg} height={55} width={55} alt="Strava" />
          </button>

          {/* connect with NRC */}
          <button
            type="button"
            className="my-2 flex min-w-[250px] items-center justify-center rounded-md bg-white p-2 transition-transform hover:scale-105"
            onClick={() => toast('Coming soon', { icon: '🚧' })}
          >
            <div className="rounded-md bg-white p-4">Nike Run Club</div>
            <Image src={NRCImg} height={55} width={55} alt="NRC" />
          </button>
        </div>
        {/* )} */}
      </div>
    </main>
  );
}
