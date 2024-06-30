'use client';

import React from 'react';
import { DateRangePicker, Select, SelectItem } from '@nextui-org/react';
import { ZonedDateTime } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';

import { ChallengeTypes } from '@/constants';

type Step1Props = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  totalTimes: number;
  setTotalTimes: (totalTimes: number) => void;
  duration: { start: ZonedDateTime; end: ZonedDateTime };
  setDuration: (duration: { start: ZonedDateTime; end: ZonedDateTime }) => void;
  challengeType: ChallengeTypes;
  setChallengeType: (challengeType: ChallengeTypes) => void;
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
  challengeType,
  setChallengeType,
  setStep,
}: Step1Props) {
  return (
    <div className="flex w-full flex-col items-center justify-start px-8">
      {/* todo: add public challenge later */}
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
        type="text"
        label="Challenge Name"
        placeholder="Enter name of the challenge"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-4"
        required
      />

      <Input
        label="Description"
        placeholder="Describe your challenge here!"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="my-4"
      />

      <Select label="Challenge Type" className="my-4" defaultSelectedKeys={[ChallengeTypes.Run]}>
        {Object.values(ChallengeTypes)
          .filter((type: ChallengeTypes) => type !== ChallengeTypes.NFC_Chip)
          .map((type: ChallengeTypes) => (
            <SelectItem key={type} onClick={() => setChallengeType(type)}>
              {type}
            </SelectItem>
          ))}
      </Select>

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

      <Button onClick={() => setStep(2)} className="mt-8 min-h-12 w-full" color="primary">
        Next
      </Button>
    </div>
  );
}
