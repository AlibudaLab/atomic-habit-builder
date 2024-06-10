/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import React, { useCallback } from 'react';
import { Input } from '@nextui-org/input';
import { ChallengeTypes } from '@/constants';
import { Button } from '@nextui-org/button';
import { usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import copy from 'clipboard-copy';
import Link from 'next/link';

type Step3Props = {
  accessCode: string;
  name?: string;
  stake?: number;
  challengeType: ChallengeTypes;
  challengeId: number;
};

export default function CreateStep3({ accessCode, challengeId }: Step3Props) {
  const origin = window.location.origin;

  const link = origin + `/habit/stake/${challengeId}?code=${accessCode}`;

  const onClickCopy = useCallback(() => {
    copy(link)
      .then(() => {
        toast.success('Link Copied!');
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  }, [link]);

  return (
    <div className="flex flex-col items-center justify-start p-8 ">
      <p className="px-4 py-8 text-center text-lg">Challenge Created!</p>

      <p className="text-grey-800 text-center text-sm">
        Share this link with your friends to join the challenge
      </p>

      <p className="my-4 text-center text-base">{link}</p>

      <Button className="my-8" onClick={onClickCopy} color="primary" variant="bordered">
        COPY LINK
      </Button>

      <Link
        href={`/habit/stake/${challengeId}?code=${accessCode}`}
        className="w-full justify-center"
      >
        <Button className="my-8 w-full" color="primary">
          Start Challenge
        </Button>
      </Link>
    </div>
  );
}