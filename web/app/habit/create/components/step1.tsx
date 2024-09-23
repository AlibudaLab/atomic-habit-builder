'use client';

import React from 'react';
import { DateRangePicker, Select, SelectItem, Textarea } from '@nextui-org/react';
import { ZonedDateTime } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';

import { ChallengeTypes } from '@/constants';
import { logEventSimple } from '@/utils/gtag';

const defaultSelectedKeys = [ChallengeTypes.Run];

type Step1Props = {
  name: string;
  setName: (name: string) => void;
  description: string;
  setDescription: (description: string) => void;
  totalTimes: number;
  setIsPublic: (isPublic: boolean) => void;
  isPublic: boolean;
  setTotalTimes: (totalTimes: number) => void;
  duration: { start: ZonedDateTime; end: ZonedDateTime };
  setDuration: (duration: { start: ZonedDateTime; end: ZonedDateTime }) => void;
  challengeType: ChallengeTypes;
  setChallengeType: (challengeType: ChallengeTypes) => void;
  minDistance: number;
  setMinDistance: (minDistance: number) => void;
  minTime: number;
  setMinTime: (minTime: number) => void;
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
  isPublic,
  setIsPublic,
  challengeType,
  setChallengeType,
  minDistance,
  setMinDistance,
  minTime,
  setMinTime,
  setStep,
}: Step1Props) {
  return (
    <div className="flex w-full flex-col items-center justify-start">
      <div className="my-4 mb-2 w-full items-center justify-between px-1">
        <div className="flex justify-between">
          <span className="text-sm">{isPublic ? 'Public' : 'Private'} Challenge</span>
          <Switch size="sm" isSelected={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
        </div>

        {/* description */}
        <div className="text-xs text-gray-400">
          {isPublic
            ? 'Anyone can view / join the challenge'
            : 'Only people with invite link can join the challenge'}
        </div>
      </div>

      <Input
        type="text"
        label="Challenge Name"
        placeholder="Enter name of the challenge"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="my-4"
        required
      />

      <Textarea
        label="Description"
        placeholder="Describe your challenge here!"
        value={description}
        onValueChange={setDescription}
        className="my-4"
      />

      <Select label="Challenge Type" className="my-4" defaultSelectedKeys={defaultSelectedKeys}>
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

      {challengeType === ChallengeTypes.Run || challengeType === ChallengeTypes.Cycling ? (
        <>
          <Input
            type="number"
            label="Minimum Distance (km)"
            value={minDistance.toString()}
            onChange={(e) => setMinDistance(Number(e.target.value))}
            placeholder="Enter minimum distance"
            className="my-4"
            description="Minimum distance requirement for a check-in"
          />
          <Input
            type="number"
            label="Minimum Time (minutes)"
            value={minTime.toString()}
            onChange={(e) => setMinTime(Number(e.target.value))}
            placeholder="Enter minimum time"
            className="my-4"
            description="Minimum time requirement for a check-in"
          />
        </>
      ) : challengeType === ChallengeTypes.Workout ? (
        <Input
          type="number"
          label="Minimum Time (minutes)"
          value={minTime.toString()}
          onChange={(e) => setMinTime(Number(e.target.value))}
          placeholder="Enter minimum time"
          className="my-4"
          description="Minimum time requirement for a check-in"
        />
      ) : null}

      <DateRangePicker
        label="Challenge Duration"
        className="my-4"
        granularity="day"
        value={duration}
        onChange={(newDuration) => {
          if (newDuration === null) return;
          setDuration(newDuration);
        }}
      />

      <Button
        onClick={() => {
          setStep(2);
          logEventSimple({ eventName: 'click_create_next_button', category: 'create' });
        }}
        className="mt-8 min-h-12 w-full"
        color="primary"
        isDisabled={!name || !description}
      >
        Next
      </Button>
    </div>
  );
}
