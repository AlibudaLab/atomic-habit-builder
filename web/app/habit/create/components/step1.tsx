'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Select, SelectItem, Textarea, DatePicker } from '@nextui-org/react';
import { ZonedDateTime } from '@internationalized/date';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import { Switch } from '@nextui-org/switch';

import { ChallengeTypes } from '@/constants';
import { logEventSimple } from '@/utils/gtag';
import { getDurationString } from '@/utils/timestamp';
import moment from 'moment';

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
  startDate: ZonedDateTime;
  setStartDate: (date: ZonedDateTime) => void;
  endDate: ZonedDateTime;
  setEndDate: (date: ZonedDateTime) => void;
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
  startDate,
  setStartDate,
  endDate,
  setEndDate,
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
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    if (startDate >= endDate) {
      setDateError('Start date must be before end date');
    } else {
      setDateError('');
    }
  }, [startDate, endDate]);

  const startDescription = useMemo(() => {
    const now = moment();
    const start = moment(startDate.toDate());
    if (start.isBefore(now)) {
      return 'Challenge has already started';
    } else {
      const duration = moment.duration(start.diff(now));
      return `Challenge starts in ${duration.humanize()}`;
    }
  }, [startDate]);

  const endDescription = useMemo(() => {
    const now = moment();
    const start = moment(startDate.toDate());
    const end = moment(endDate.toDate());
    let timeDescription = `Total duration: ${getDurationString(
      startDate.toDate().getTime() / 1000,
      endDate.toDate().getTime() / 1000,
    )}`;
    if (start.isBefore(now) && end.isAfter(now)) {
      const duration = moment.duration(end.diff(now));
      timeDescription += ` (${duration.humanize()} left)`;
    }
    return timeDescription;
  }, [startDate, endDate]);

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

      <div className="my-4 flex w-full flex-col gap-4">
        <DatePicker
          label="Start Date and Time"
          value={startDate}
          onChange={(newDate) => {
            if (newDate) setStartDate(newDate);
          }}
          className="w-full"
          description={startDescription}
        />
        <DatePicker
          label="End Date and Time"
          value={endDate}
          onChange={(newDate) => {
            if (newDate) setEndDate(newDate);
          }}
          className="w-full"
          description={endDescription}
        />
        {dateError && <p className="text-sm text-red-500">{dateError}</p>}
      </div>

      <Button
        onClick={() => {
          if (!dateError) {
            setStep(2);
            logEventSimple({ eventName: 'click_create_next_button', category: 'create' });
          }
        }}
        className="mt-8 min-h-12 w-full"
        color="primary"
        isDisabled={!name || !description || !!dateError}
      >
        Next
      </Button>
    </div>
  );
}
