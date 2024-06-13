/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Challenge } from '@/types';
import { getCheckInDescription } from '@/utils/challenges';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';
import useFields from '@/hooks/useFields';
import useCheckInRun, { CheckInFields } from '@/hooks/transaction/useCheckInRun';
import useRunData from '@/hooks/useRunData';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import useActivityUsage from '@/hooks/useUsedActivities';
import { ActivityDropDown } from './activityDropdown';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import CheckinPopup from './CheckinPopup';
import useUserJoined from '@/hooks/useUserJoined';
import { Button } from '@nextui-org/button';

const initFields: CheckInFields = {
  challengeId: 0,
  timestamp: 0,
  v: 0,
  r: '',
  s: '',
  activityId: -1,
};

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: Challenge }) {
  const { push } = useRouter();
  const { address } = useAccount();
  const { joined, loading: loadingJoined } = useUserJoined(address, BigInt(challenge.id));
  const { fields, setField, resetFields } = useFields<CheckInFields>(initFields);
  const { activityMap, addToActivityMap } = useActivityUsage(address);
  const { checkedIn } = useUserChallengeCheckIns(address, BigInt(challenge.id));

  const challengeStarted = useMemo(
    () => moment().unix() > challenge.startTimestamp,
    [challenge.startTimestamp],
  );

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);

  const handleOpenCheckinPopup = () => setIsCheckinPopupOpen(true);
  const handleCloseCheckinPopup = () => setIsCheckinPopupOpen(false);
  const handleChallengeListClick = () => {
    push('/');
  };

  const {
    onSubmitTransaction: onCheckInTx,
    isPreparing: isCheckInPreparing,
    isLoading: isCheckInLoading,
  } = useCheckInRun(fields, () => {
    if (fields.activityId) addToActivityMap(fields.challengeId, fields.activityId.toString());
    handleOpenCheckinPopup();
    resetFields();
  });

  const {
    connected,
    runData,
    workoutData,
    error: runDataError,
    loading: stravaLoading,
  } = useRunData();

  const handleActivitySelect = (activityId: number) => {
    resetFields();
    const now = moment().unix();

    const fetchURL =
      activityId !== undefined
        ? '/api/sign?' +
          new URLSearchParams({
            address: address as string,
            activityId: activityId.toString(),
            timestamp: now.toString(),
            challengeId: challenge.id.toString(),
          }).toString()
        : '';

    const fetchSignature = async (): Promise<{ v: number; r: string; s: string }> => {
      const response = await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    };

    fetchSignature()
      .then((_signature) => {
        console.log('Signature:', _signature);
        console.log('Timestamp:', now);
        setField({
          v: _signature.v,
          r: _signature.r,
          s: _signature.s,
          challengeId: challenge.id,
          activityId: activityId,
          timestamp: now,
        });
      })
      .catch((error) => {
        console.error('Error fetching the signature:', error);
      });
  };

  const onClickCheckIn = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (fields.activityId === -1) {
      toast.error('Please select an activity');
      return;
    }
    onCheckInTx();
  };

  // only show this button if user is not connected to strava
  const onClickConnectStrava = useCallback(() => {
    // path that user will be redirected to after connecting to strava
    const redirectUri = window.origin + '/connect-run/strava';

    // after verification on the connect-run/strava page, direct back to this page
    const authUrl = stravaUtils.getAuthURL(redirectUri, window.location.href);
    window.location = authUrl as any;
  }, []);

  // if user has not joined the challenge, redirect to the stake page
  useEffect(() => {
    if (!loadingJoined && !joined) {
      push(`/habit/stake/${challenge.id}`);
    }
  }, [joined, loadingJoined, challenge.id, push]);

  return (
    <div className="flex max-w-96 flex-col items-center justify-center">
      {/* overview   */}
      <ChallengeBoxFilled challenge={challenge} checkedIn={checkedIn} />

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="pb-2 text-xl font-bold text-dark"> Goal </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
      </div>

      {/* check in description  */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="pb-2 text-xl font-bold text-dark"> Check In </div>
        <div className="text-sm text-primary"> {getCheckInDescription(challenge.type)} </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="pb-2 text-xl font-bold text-dark"> Stake Amount </div>
        <div className="text-sm text-primary"> {`${formatUnits(challenge.stake, 6)} USDC`} </div>
      </div>

      {connected && (
        <div className="flex w-full justify-center px-2 pt-4">
          <ActivityDropDown
            fields={fields}
            onActivitySelect={handleActivitySelect}
            loading={stravaLoading}
            activities={challenge.type === ChallengeTypes.Run ? runData : workoutData}
            usedActivities={activityMap[challenge.id]}
          />
        </div>
      )}

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id}`}>
          <Button type="button" color="primary" className="mt-12 min-h-12 w-3/4 max-w-56">
            Finish
          </Button>
        </Link>
      ) : connected && !runDataError ? (
        <Button
          type="button"
          color="primary"
          className="mt-12 min-h-12 w-3/4 max-w-56"
          onClick={onClickCheckIn}
          isDisabled={
            !challengeStarted || isCheckInLoading || isCheckInPreparing || fields.activityId === -1
          }
          isLoading={isCheckInLoading}
        >
          {' '}
          {challengeStarted ? 'Check In' : 'Not started yet'}{' '}
        </Button>
      ) : (
        <Button
          type="button"
          color="primary"
          className="mt-12 min-h-12 w-3/4 max-w-56"
          onClick={onClickConnectStrava}
        >
          Connect with Strava
        </Button>
      )}

      {isCheckinPopupOpen && (
        <CheckinPopup
          challenge={challenge}
          onClose={handleCloseCheckinPopup}
          onCheckInPageClick={handleChallengeListClick}
        />
      )}
    </div>
  );
}
