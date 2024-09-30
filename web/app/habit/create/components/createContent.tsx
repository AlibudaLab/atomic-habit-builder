'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
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
import { usdcAddr } from '@/constants';
import { useAllChallenges } from '@/providers/ChallengesProvider';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { logEventSimple } from '@/utils/gtag';

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function Create() {
  const { address } = usePasskeyAccount();

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);

  const defaultStart = useMemo(() => moment().startOf('day'), []);

  // 3 steps: input, review, success
  const [step, setStep] = useState(1);

  // generate a random char and number string, 6 chars
  const accessCode = useMemo(() => Math.random().toString(36).substring(2, 8).toUpperCase(), []);

  const { refetch } = useAllChallenges();

  // all inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [totalTimes, setTotalTimes] = useState(5);
  const [duration, setDuration] = useState({
    start: parseAbsoluteToLocal(defaultStart.toISOString()),
    end: parseAbsoluteToLocal(defaultStart.add(1, 'week').toISOString()),
  });
  const [type, setType] = useState(ChallengeTypes.Run);
  const [minDistance, setMinDistance] = useState(0);
  const [minTime, setMinTime] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const [stake, setStake] = useState(20);
  const [donatioAddr, setDonationAddr] = useState<Address>(defaultDonationDest.address);
  const [allowSelfCheckIn, setAllowSelfCheckIn] = useState(false);

  // only set after the challenge creation tx
  const [createdChallengeId, setCreatedChallengeId] = useState<number>(0);

  const stakeInUSDC = useMemo(() => parseUnits(stake.toString(), 6), [stake]);

  const onCreateSuccess = useCallback(
    (receipt: any, events: DecodeEventLogReturnType[]) => {
      const targetEvent = events.find((e) => e.eventName === 'Create');
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
          public: isPublic,
          challengeId,
          accessCode: accessCode,
          minDistance,
          minTime,
          user: address,
          allowSelfCheckIn,
        }),
      })
        .then((res) => {
          toast.success('Successfully created!! 🥳🥳🥳', { id: 'create' });
          refetch();
          setCreatedChallengeId(challengeId);
          setStep(3);
        })
        .catch((error) => {
          console.error('Error adding challenge:', error);
          toast.error('Error adding Challenge to DB.');
        });
    },
    [
      name,
      description,
      type,
      accessCode,
      address,
      minDistance,
      minTime,
      isPublic,
      allowSelfCheckIn,
      refetch,
    ],
  );

  const { onSubmitTransaction: create, isLoading: isCreating } = useCreateChallenge(
    defaultVerifier,
    totalTimes,
    moment.utc(duration.start.toAbsoluteString()).unix(),
    moment.utc(duration.end.toAbsoluteString()).unix() - 1,
    moment.utc(duration.end.toAbsoluteString()).unix(),
    donatioAddr,
    usdcAddr,
    stakeInUSDC,
    onCreateSuccess,
  );

  const onClickCreate = useCallback(async () => {
    // submit create tx
    create();
    logEventSimple({ eventName: 'click_create_button', category: 'create' });
  }, [create]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start pt-8">
      <SubTitle text="Let's Build Another Habit" />

      <div
        className={`fixed bottom-0 left-0 right-0 h-[calc(100vh-180px)] w-full overflow-y-auto rounded-t-[20px] bg-white p-6 pb-24 shadow-large transition-transform duration-300 ease-in-out ${
          loaded ? 'translate-y-0' : 'translate-y-full'
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
              type="button"
            >
              {' '}
              1{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 2 ? 'bg-dark text-white' : 'border border-solid border-dark'
              } `}
              type="button"
            >
              {' '}
              2{' '}
            </button>
            <button
              className={`text-md m-2 flex h-6 w-6 items-center justify-center rounded-full p-1 text-center ${
                step === 3 ? 'bg-dark text-white' : 'border border-solid border-dark'
              } `}
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
            isPublic={isPublic}
            setIsPublic={setIsPublic}
            challengeType={type}
            setChallengeType={setType}
            minDistance={minDistance}
            setMinDistance={setMinDistance}
            minTime={minTime}
            setMinTime={setMinTime}
            setStep={setStep}
          />
        )}

        {step === 2 && (
          <CreateStep2
            stake={Number(stake)}
            setStake={setStake}
            setStep={setStep}
            setDonationAddr={setDonationAddr}
            onClickCreate={onClickCreate}
            isCreating={isCreating}
            allowManualCheckIn={allowSelfCheckIn} // Updated prop name
            setAllowManualCheckIn={setAllowSelfCheckIn} // Updated prop name
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
