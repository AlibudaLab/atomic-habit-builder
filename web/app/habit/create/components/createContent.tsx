/* eslint-disable react/jsx-pascal-case */
'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import CreateStep1 from './step1';
import CreateStep2 from './step2';
import moment from 'moment';
import './create.css';
import Link from 'next/link';
import { ChallengeTypes, donationDestinations } from '@/constants';
import { Address } from 'viem';

const defaultDonationDest = donationDestinations[0];

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
  const [type, setType] = useState(ChallengeTypes.Run);
  const [donatioAddr, setDonationAddr] = useState<Address>(defaultDonationDest.address);

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
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 1 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
              onClick={() => setStep(1)}
              type="button"
            >
              {' '}
              1{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 2 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
              onClick={() => setStep(2)}
              type="button"
            >
              {' '}
              2{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 3 ? 'bg-dark text-white' : 'border-dark border border-solid'
              } `}
              onClick={() => setStep(3)}
              type="button"
            >
              {' '}
              3{' '}
            </button>
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
            setStep={setStep}
          />
        )}

        {step === 2 && (
          <CreateStep2
            challengeType={type}
            setChallengeType={setType}
            setDonationAddr={setDonationAddr}
          />
        )}
      </div>
    </div>
  );
}
