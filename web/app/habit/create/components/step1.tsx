/* eslint-disable jsx-a11y/anchor-is-valid */
'use client';

import React from 'react';
import moment from 'moment';
import { DateRangePicker } from '@nextui-org/react';
import { parseDate } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';

type Step1Props = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  totalTimes: number;
  setTotalTimes: (totalTimes: number) => void;
  startTimestamp: number;
  setStartTimestamp: (startTimestamp: number) => void;
  endTimestamp: number;
  setEndTimestamp: (endTimestamp: number) => void;
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
  startTimestamp,
  setStartTimestamp,
  endTimestamp,
  setEndTimestamp,
  stake,
  setStake,
  setStep,
}: Step1Props) {
  return (
    <div className="flex max-w-[500px] flex-col items-center justify-start px-8">
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
        value={{
          start: parseDate(moment.unix(startTimestamp).format('YYYY-MM-DD')),
          end: parseDate(moment.unix(endTimestamp).format('YYYY-MM-DD')),
        }}
        onChange={(value) => {
          setStartTimestamp(moment(value.start).unix());
          setEndTimestamp(moment(value.end).unix());
        }}
      />

      <Input
        type="number"
        label="Stake"
        className="my-4"
        value={stake.toString()}
        onChange={(e) => setStake(Number(e.target.value))}
        placeholder="100"
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-small text-default-400"> USDC </span>
          </div>
        }
      />

      <Button onClick={() => setStep(2)} className="min-h-12 w-full" color="primary">
        Next
      </Button>
    </div>
  );
}
