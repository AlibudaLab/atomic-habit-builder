/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import React from 'react';
import { DateRangePicker } from '@nextui-org/react';
import { ZonedDateTime } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';

import usdcLogo from '@/imgs/coins/usdc.png';
import Image from 'next/image';

type Step1Props = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  totalTimes: number;
  setTotalTimes: (totalTimes: number) => void;
  duration: { start: ZonedDateTime; end: ZonedDateTime };
  setDuration: (duration: { start: ZonedDateTime; end: ZonedDateTime }) => void;
  stake: number;
  setStake: (stake: number) => void;
  setStep: (step: number) => void;
};

export default function CreateStep1({
  name,
  setName,
  description,
  setDescription,
  totalTimes,
  setTotalTimes,
  duration,
  setDuration,
  stake,
  setStake,
  setStep,
}: Step1Props) {
  return (
    <div className="flex w-full flex-col items-center justify-start px-8">
      {/* todo: add public challenge later */}

      <Input
        type="text"
        label="Challenge Name"
        placeholder="Enter name of the challenge"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-4"
        required
      />
      <Switch
        isDisabled
        defaultSelected
        size="sm"
        className="my-2"
        // description="Public challenges are visible to everyone"
      >
        {' '}
        <p className="text-sm"> Private </p>{' '}
      </Switch>

      <Input
        label="Description"
        placeholder="Describe your challenge here!"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="my-4"
      />

      <Input
        type="number"
        label="Total Times"
        value={totalTimes.toString()}
        onChange={(e) => setTotalTimes(Number(e.target.value))}
        placeholder="5"
        className="my-4"
        description="How many times participants need to check in to complete the challenge"
      />

      <DateRangePicker
        label="Challenge Duration"
        className="my-4"
        granularity="day"
        value={duration}
        onChange={setDuration}
      />

      <Input
        type="number"
        label="Stake"
        className="my-4"
        value={stake.toString()}
        onChange={(e) => setStake(Number(e.target.value))}
        placeholder="100"
        endContent={
          <div className="pointer-events-none flex items-center justify-center gap-2">
            <span className="text-small text-default-400"> USDC </span>
            <Image src={usdcLogo} alt="usdc" width={20} height={20} />
          </div>
        }
      />

      <Button onClick={() => setStep(2)} className="mt-8 min-h-12 w-full" color="primary">
        Next
      </Button>
    </div>
  );
}
