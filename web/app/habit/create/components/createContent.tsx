/* eslint-disable react/jsx-pascal-case */
'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import CreateStep1 from './step1';
import moment from 'moment';
import './create.css';

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function Create() {
  const { address } = useAccount();

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  // 3 steps: input, review, success
  const [step, setStep] = useState(1);

  // all inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalTimes, setTotalTimes] = useState(5);
  const [startTimestamp, setStartTimestamp] = useState(moment().add(1, 'day').unix());
  const [endTimestamp, setEndTimestamp] = useState(moment().add(1, 'week').unix());
  const [stake, setStake] = useState(0);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="pb-8 pt-2 text-center font-londrina text-xl font-bold">
        {' '}
        Let&lsquo;s Built Another Habit!{' '}
      </p>

      <div
        className={`w-full flex-grow rounded-t-[20px] p-2 shadow-large ${loaded ? 'slide-up' : ''}`}
      >
        {/* Show text "create" and then the 3 sub steps */}
        <div className="flex items-center justify-center">
          <div className="mr-6 text-xl">Create</div>
          {/* based on step, mark current page */}
          <div className="flex items-center justify-center gap-1 py-4">
            <p
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 1 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
            >
              {' '}
              1{' '}
            </p>
            <p
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 2 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
            >
              {' '}
              2{' '}
            </p>
            <p
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 3 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
            >
              {' '}
              3{' '}
            </p>
          </div>
        </div>

        {step === 1 && (
          <CreateStep1
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            totalTimes={totalTimes}
            setTotalTimes={setTotalTimes}
            startTimestamp={startTimestamp}
            setStartTimestamp={setStartTimestamp}
            endTimestamp={endTimestamp}
            setEndTimestamp={setEndTimestamp}
            stake={Number(stake)}
            setStake={setStake}
          />
        )}
      </div>
    </div>
  );
}
