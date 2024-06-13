/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import React from 'react';
import { ChallengeTypes } from '@/constants';
import { Button } from '@nextui-org/button';
import Link from 'next/link';
import { Snippet } from '@nextui-org/snippet';

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

  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-8">
      <p className="text-bold px-4 py-4 text-center font-londrina text-2xl text-primary">
        Challenge Created!
      </p>

      <p className="text-grey-800 p-4 text-center text-sm">
        Share this link with your friends to join the challenge
      </p>

      <Snippet className="m-4 w-full p-4" size="sm" hideSymbol color="default" codeString={link}>
        <span> Copy Invite Link </span>
      </Snippet>

      <Link
        href={`/habit/stake/${challengeId}?code=${accessCode}`}
        className="mt-36 w-full justify-center"
      >
        <Button className="min-h-12 w-full" color="primary">
          Start Challenge
        </Button>
      </Link>
    </div>
  );
}
