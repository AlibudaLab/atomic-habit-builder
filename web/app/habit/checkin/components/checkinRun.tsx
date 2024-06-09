/* eslint-disable react/no-array-index-key */
/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { formatUnits } from 'viem';
import { useAccount } from 'wagmi';
import { Challenge } from '@/types';
import { getCheckInDescription } from '@/utils/challenges';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';
import useCheckInRun from '@/hooks/transaction/useCheckInRun';
import useRunData from '@/hooks/useRunData';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';
import useUsedActivity from '@/hooks/useUsedActivities';
import { ActivityDropDown } from './activityDropdown';
import WaitingTx from 'app/habit/components/WaitingTx';
import { ChallengeBoxFilled } from 'app/habit/components/ChallengeBox';
import CheckinPopup from './CheckinPopup';

/**
 * TEMP: Workout & Running activity check-in
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: Challenge }) {
  const { push } = useRouter();

  const { address } = useAccount();

  const { activities: usedActivities, updateUsedActivities } = useUsedActivity();

  const [activityIdx, setActivityIdx] = useState(-1);

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
    activityId: checkInPendingId,
    checkIn: {
      onSubmitTransaction: onCheckInTx,
      isPreparing: isCheckInPreparing,
      isLoading: isCheckInLoading,
    },
  } = useCheckInRun(challenge, activityIdx, () => {
    if (checkInPendingId) updateUsedActivities(checkInPendingId.toString());
    setActivityIdx(-1);
    handleOpenCheckinPopup();
  });

  const {
    connected,
    runData,
    workoutData,
    error: runDataError,
    loading: stravaLoading,
  } = useRunData();

  const onClickCheckIn = async () => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (activityIdx === -1) {
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

  return (
    <div className="flex max-w-96 flex-col items-center justify-center">
      {/* overview   */}
      <ChallengeBoxFilled challenge={challenge} checkedIn={checkedIn} />

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Goal </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
      </div>

      {/* checkIn description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Check In </div>
        <div className="text-sm text-primary"> {getCheckInDescription(challenge.type)} </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-dark pb-2 text-xl font-bold"> Stake Amount </div>
        <div className="text-sm text-primary"> {`${formatUnits(challenge.stake, 6)} USDC`} </div>
      </div>

      {connected && (
        <div className="flex w-full justify-center px-2 pt-4">
          <ActivityDropDown
            loading={stravaLoading}
            setActivityIdx={setActivityIdx}
            activityIdx={activityIdx}
            activities={challenge.type === ChallengeTypes.Run ? runData : workoutData}
            usedActivities={usedActivities}
          />
        </div>
      )}

      {checkedIn >= challenge.targetNum ? (
        <Link href={`/habit/claim/${challenge.id}`}>
          <button
            type="button"
            className="wrapped mt-12 min-h-16 rounded-lg px-6 py-2 text-lg font-bold text-primary transition-transform duration-300 focus:scale-105"
          >
            Finish
          </button>
        </Link>
      ) : connected && !runDataError ? (
        <button
          type="button"
          className="wrapped mt-12  min-h-16 w-3/4 max-w-56 rounded-lg text-lg font-bold text-primary transition-transform duration-300 focus:scale-105 disabled:opacity-50"
          onClick={onClickCheckIn}
          disabled={
            !challengeStarted || isCheckInLoading || isCheckInPreparing || activityIdx === -1
          }
        >
          {' '}
          {isCheckInLoading ? (
            <WaitingTx />
          ) : challengeStarted ? (
            'Check In'
          ) : (
            'Not started yet'
          )}{' '}
        </button>
      ) : (
        <button
          type="button"
          className="wrapped mt-12 min-h-16 rounded-lg px-6 py-2 text-lg font-bold text-primary transition-transform duration-300 focus:scale-105"
          onClick={onClickConnectStrava}
        >
          Connect with Strava
        </button>
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
