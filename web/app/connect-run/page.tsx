/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import Header from '../habit/components/Header';
import Image from 'next/image';

import * as stravaUtils from '@/utils/strava';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@nextui-org/button';

const StravaImg = require('../../src/imgs/apps/strava.png') as string;

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
          <Button
            type="button"
            className="my-2 p-2 min-w-[250px]"
            onClick={onClickStrava}
            color="primary"
            endContent={<Image src={StravaImg} height={55} width={55} alt="Strava" />}
          >
            Link Strava
          </Button>
        </div>
        {/* )} */}
      </div>
    </main>
  );
}
