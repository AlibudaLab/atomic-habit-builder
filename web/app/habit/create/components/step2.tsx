'use client';

import React from 'react';
import moment from 'moment';
import { DateRangePicker } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { ChallengeTypes } from '@/constants';

type Step2Props = {
  // challengeType: ChallengeTypes;
  // setChallengeType: (challengeType: ChallengeTypes) => void;
};

export default function CreateStep2({
  // challengeType,
  // setChallengeType,
}: Step2Props) {
  return (
    <div className="flex max-w-[500px] flex-col items-center justify-start px-10">
      <Input
        type="text"
        label="Verifier"
        value='Strava'
        className="my-4"
        readOnly
      />

      <Input
        type="text"
        label="Extra Yield Source"
        className="my-4"
        value="None"
        readOnly
      />
    </div>
  );
}
