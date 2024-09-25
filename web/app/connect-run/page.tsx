'use client';

import Image from 'next/image';
import * as stravaUtils from '@/utils/strava';
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@nextui-org/button';

const StravaImg = require('../../src/imgs/apps/strava.png') as string;

export default function ConnectRunDataSource() {
  // if url contains 'original_path', then pass this info to the strava callback page, so after connecting we can go back
  const searchParams = useSearchParams();
  const originalPath = searchParams ? searchParams.get('original_path') : null;

  const pathName = usePathname();

  const onClickStrava = useCallback(() => {
    if (typeof window === 'undefined') return;
    const redirectUri = `${window.origin}${pathName}/strava`;
    const authUrl = stravaUtils.getAuthURL(redirectUri, originalPath);
    window.location.href = authUrl;
  }, [originalPath, pathName]);

  return (
    <>
      <div className="py-4 text-lg font-bold">Link Run & Workout Data Source</div>
      <div>
        <div className="gap-2 sm:flex">
          {/* connect with strava */}
          <Button
            type="button"
            className="my-2 min-w-[250px] p-2"
            onClick={onClickStrava}
            color="primary"
            endContent={<Image src={StravaImg} height={55} width={55} alt="Strava" />}
          >
            Link Strava
          </Button>
        </div>
      </div>
    </>
  );
}
