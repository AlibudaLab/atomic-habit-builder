/* eslint-disable react/jsx-pascal-case */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DateValue } from '@nextui-org/react';
import { useAccount } from 'wagmi';
import CreateStep1 from './step1';
import CreateStep2 from './step2';
import CreateStep3 from './step3';
import moment from 'moment';
import './create.css';

import { ChallengeTypes, defaultVerifier, donationDestinations } from '@/constants';
import { Address, DecodeEventLogReturnType, parseUnits } from 'viem';
import useCreateChallenge from '@/hooks/transaction/useCreate';
import toast from 'react-hot-toast';
import { parseAbsoluteToLocal } from '@internationalized/date';

const defaultDonationDest = donationDestinations[0];

const defaultStart = moment().hour(0).minutes(0).seconds(0).milliseconds(0).add(1, 'day');

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

  // generate a random char and number string, 6 chars
  const accessCode = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  // all inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalTimes, setTotalTimes] = useState(5);

  const [duration, setDuration] = useState({
    start: parseAbsoluteToLocal(defaultStart.toISOString()),
    end: parseAbsoluteToLocal(defaultStart.add(1, 'week').toISOString()),
  });

  const [stake, setStake] = useState(0);
  const [type, setType] = useState(ChallengeTypes.Run);
  const [donatioAddr, setDonationAddr] = useState<Address>(defaultDonationDest.address);

  // only set after the challenge creation tx
  const [createdChallengeId, setCreatedChallengeId] = useState<number>(0);

  const stakeInUSDC = useMemo(() => parseUnits(stake.toString(), 6), [stake]);

  const onCreateSuccess = useCallback(
    (receipt: any, events: DecodeEventLogReturnType[]) => {
      const targetEvent = events.find((e) => e.eventName === 'Register');
      if (!targetEvent) {
        return toast.error('Error Creating a Challenge.');
      }

      const challengeId = Number(((targetEvent.args as any).challengeId as bigint).toString());

      // add this to firestore DB
      fetch('/api/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          type,
          public: false,
          challengeId,
          accessCode: accessCode,
          user: address,
        }),
      })
        .then((res) => {
          console.log('api response', res);
          setCreatedChallengeId(challengeId);
          setStep(3);
        })
        .catch((error) => {
          console.error('Error adding challenge:', error);
          toast.error('Error Creating a Challenge.');
        });
    },
    [name, description, type, accessCode, address],
  );

  const { onSubmitTransaction: create, isLoading: isCreating } = useCreateChallenge(
    defaultVerifier,
    name,
    totalTimes,
    moment.utc(duration.start.toAbsoluteString()).unix(),
    moment.utc(duration.end.toAbsoluteString()).unix(),
    moment.utc(duration.end.toAbsoluteString()).unix(),
    donatioAddr,
    stakeInUSDC,
    onCreateSuccess,
  );

  const onClickCreate = useCallback(async () => {
    // submit create tx
    create();
  }, [create]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <p className="pb-8 pt-2 text-center font-londrina text-xl font-bold">
        {' '}
        Let&lsquo;s Built Another Habit!{' '}
      </p>

      <div
        className={`h-full w-screen max-w-[500px] flex-grow flex-col rounded-t-[20px] p-2 pb-32 shadow-large ${
          loaded ? 'slide-up' : ''
        }`}
      >
        {/* Show text "create" and then the 3 sub steps */}
        <div className="flex items-center justify-center">
          <div className="mr-6 text-xl">Create</div>
          {/* based on step, mark current page */}
          <div className="flex items-center justify-center gap-1 py-4">
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 1 ? 'bg-dark text-white' : 'border border-solid border-dark'
              } `}
              onClick={() => setStep(1)}
              type="button"
            >
              {' '}
              1{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 2 ? 'bg-dark text-white' : 'border border-solid border-dark'
              } `}
              onClick={() => setStep(2)}
              type="button"
            >
              {' '}
              2{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 3 ? 'bg-dark text-white' : 'border border-solid border-dark'
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
            duration={duration}
            setDuration={setDuration}
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
            onClickCreate={onClickCreate}
            isCreating={isCreating}
          />
        )}

        {step === 3 && (
          <CreateStep3
            accessCode={accessCode}
            name={name}
            stake={stake}
            challengeType={type}
            challengeId={createdChallengeId}
          />
        )}
      </div>
    </div>
  );
}
