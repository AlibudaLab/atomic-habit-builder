'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import moment, { now } from 'moment';
import { formatUnits } from 'viem';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { ChallengeWithCheckIns, UserChallengeStatus } from '@/types';
import * as stravaUtils from '@/utils/strava';
import { ChallengeTypes } from '@/constants';
import useFields from '@/hooks/useFields';
import useCheckInRun, { CheckInFields } from '@/hooks/transaction/useCheckInRun';
import useStravaData from '@/hooks/useStravaData';
import useActivityUsage from '@/hooks/useActivityUsage';
import { ActivityDropDown } from './activityDropdown';
import { ChallengePreview } from 'app/habit/components/ChallengeBox';
import CheckinPopup from './CheckinPopup';
import { Button } from '@nextui-org/react';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import Leaderboard from 'app/habit/components/Leaderboard';
import { logEventSimple } from '@/utils/gtag';
import { getCountdownString } from '@/utils/timestamp';
import ManualCheckInButton from './ManualCheckInButton';
import useInviteLink from '@/hooks/useInviteLink';
import { CopyIcon } from 'lucide-react';
import { getChallengeRequirementDescription } from '@/utils/challenges';

const initFields: CheckInFields = {
  challengeId: 0,
  signature: '0x',
  activityId: 0,
};

/**
 * @param param0
 * @returns
 */
export default function RunCheckIn({ challenge }: { challenge: ChallengeWithCheckIns }) {
  const { push } = useRouter();
  const { address } = usePasskeyAccount();
  const [chosenActivityId, setChosenActivityId] = useState<number>(0);
  const { fields, setField, resetFields } = useFields<CheckInFields>(initFields);
  const { activityMap, addToActivityMap } = useActivityUsage(address);
  const [isSigning, setIsSigning] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState<'strava' | 'self'>('strava');
  const { copyInviteLink } = useInviteLink(challenge.id, challenge.accessCode);

  const { refetch: refetchAll } = useUserChallenges();

  const challengeStarted = useMemo(
    () => moment().unix() > challenge.startTimestamp,
    [challenge.startTimestamp],
  );

  const challengeEnded = useMemo(
    () => moment().unix() > challenge.endTimestamp,
    [challenge.endTimestamp],
  );

  const canCheckInNow = useMemo(
    () => challengeStarted && !challengeEnded,
    [challengeStarted, challengeEnded],
  );

  const [isCheckinPopupOpen, setIsCheckinPopupOpen] = useState(false);
  const [lastCheckedInActivity, setLastCheckedInActivity] = useState<{
    id: number;
    type: string;
    name: string;
    moving_time: number;
    distance?: number;
    polyline?: string;
  } | null>(null);

  const handleOpenCheckinPopup = useCallback(() => setIsCheckinPopupOpen(true), []);
  const handleCloseCheckinPopup = useCallback(() => setIsCheckinPopupOpen(false), []);
  const handleChallengeListClick = useCallback(() => {
    push('/');
  }, [push]);

  const {
    connected: verifierConnected,
    runData,
    workoutData,
    cyclingData,
    swimData,
    loading: stravaLoading,
  } = useStravaData(challenge);

  // sign when address and activityId are ready (chosen)
  useEffect(() => {
    if (!address || (checkInMethod === 'strava' && chosenActivityId === 0)) return;

    const id = checkInMethod === 'self' ? moment().unix() : chosenActivityId;

    const fetchURL =
      '/api/sign?' +
      new URLSearchParams({
        address: address as string,
        activityId: id.toString(),
        challengeId: challenge.id.toString(),
      }).toString();

    const fetchSignature = async (): Promise<{ signature: `0x${string}` }> => {
      const response = await fetch(fetchURL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      return data;
    };
    setIsSigning(true);

    fetchSignature()
      .then((res) => {
        setField({
          signature: res.signature,
          challengeId: challenge.id,
          activityId: id,
        });
      })
      .catch((error) => {
        console.error('Error fetching the signature:', error);
      })
      .finally(() => {
        setIsSigning(false);
      });
  }, [address, chosenActivityId, challenge.id, setField, checkInMethod]);

  // only show this button if user is not connected to strava
  const onClickConnectStrava = useCallback(() => {
    logEventSimple({ eventName: 'click_connect_strava', category: 'challenge' });
    // path that user will be redirected to after connecting to strava
    const redirectUri = window.origin + '/connect-run/strava';

    // after verification on the connect-run/strava page, direct back to this page
    const authUrl = stravaUtils.getAuthURL(redirectUri, window.location.href);
    window.location = authUrl as any;
  }, []);

  const activitiesToUse: stravaUtils.StravaData[] = useMemo(() => {
    switch (challenge.type) {
      case ChallengeTypes.Workout:
        return workoutData;
      case ChallengeTypes.Cycling:
        return cyclingData;
      case ChallengeTypes.Swim:
        return swimData;
      case ChallengeTypes.Run:
      default:
        return runData;
    }
  }, [challenge.type, workoutData, cyclingData, swimData, runData]);

  const { onSubmitTransaction: onCheckInTx, isLoading: isCheckInLoading } = useCheckInRun(
    fields,
    () => {
      if (fields.activityId) {
        addToActivityMap(fields.challengeId, fields.activityId.toString());
        // Find the checked-in activity
        const checkedInActivity = activitiesToUse.find((a) => a.id === fields.activityId);
        if (checkedInActivity) {
          const baseActivity = {
            id: checkedInActivity.id,
            type: challenge.type,
            name: checkedInActivity.name,
            moving_time: checkedInActivity.moving_time,
          };

          const activityToSet =
            'distance' in checkedInActivity && 'map' in checkedInActivity
              ? {
                  ...baseActivity,
                  distance: checkedInActivity.distance,
                  polyline: checkedInActivity.map.summary_polyline,
                }
              : baseActivity;

          setLastCheckedInActivity(activityToSet);
        }
      }
      resetFields();
      Promise.all([refetchAll()]).catch((error) => {
        console.error('Error refetching data:', error);
        // Optionally, handle the error more specifically here
      });
      handleOpenCheckinPopup();
    },
  );

  const onClickStravaCheckIn = async () => {
    if (fields.activityId === 0) {
      toast.error('Please select an activity');
      return;
    }
    onCheckInTx();
  };

  const renderCheckInOptions = () => {
    if (!canCheckInNow) return null;

    if (checkInMethod === 'self') {
      return (
        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <div className="h-[60px] w-full" />
          <ManualCheckInButton
            isLoading={isCheckInLoading || isSigning}
            challengeType={challenge.type}
            onConfirm={onCheckInTx}
          />
        </div>
      );
    }

    if (!verifierConnected) {
      return (
        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <div className="h-[60px] w-full max-w-sm" />
          <Button
            type="button"
            color="primary"
            className="mt-4 min-h-12 w-full max-w-56"
            onClick={onClickConnectStrava}
          >
            Connect with Strava
          </Button>
        </div>
      );
    }

    return (
      <div className="mt-4 flex w-full flex-col items-center justify-center">
        <div className="h-[60px] w-full">
          {checkInMethod === 'strava' && (
            <ActivityDropDown
              isDisabled={!address}
              fields={fields}
              onActivitySelect={setChosenActivityId}
              loading={stravaLoading}
              activities={activitiesToUse}
              usedActivities={activityMap[challenge.id]}
            />
          )}
        </div>
        <Button
          type="button"
          color="primary"
          className="mt-4 min-h-12 w-full"
          onClick={onClickStravaCheckIn}
          isDisabled={isCheckInLoading || isSigning || chosenActivityId === 0}
          isLoading={isCheckInLoading || isSigning}
        >
          Submit Check-In
        </Button>
      </div>
    );
  };

  const requirementDescription = useMemo(() => getChallengeRequirementDescription(challenge), [challenge]);

  return (
    <div className="flex h-screen w-full flex-col items-center px-4 text-center">
      {/* overview   */}
      <div className="my-4 w-full">
        <ChallengePreview
          challenge={challenge}
          fullWidth
          checkedIn={challenge.checkedIn}
          showHint={false}
        />
      </div>

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-lg font-bold text-dark"> Description </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
        {requirementDescription && (
          <div className="mt-1 font-londrina text-sm text-gray-500">
            {requirementDescription}
          </div>
        )}
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-lg font-bold text-dark"> Staked Amount </div>
        <div className="flex text-sm text-primary">
          {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
        </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-lg font-bold text-dark"> Invite Others </div>
        <div className="flex gap-2 text-sm text-primary">
          Invite your friends to join the challenge
          <button type="button" onClick={copyInviteLink}>
            <CopyIcon size={14} />
          </button>
        </div>
      </div>

      {/* New countdown badge with reduced margins */}
      <div className="my-4 flex w-full justify-center">
        {challenge.endTimestamp > now() / 1000 ? (
          <>
            <span className="text-sm font-semibold text-dark">⏰ Challenge ends in</span>
            <span className="ml-1 text-sm font-bold text-dark">
              {getCountdownString(challenge.endTimestamp)}
            </span>
          </>
        ) : (
          <span className="text-sm font-semibold text-dark">🎉 Challenge ended</span>
        )}
      </div>

      {/* middle section: if timestamp is not valid, show warning message */}

      {challenge.status === UserChallengeStatus.Ongoing && canCheckInNow && (
        <>
          {renderCheckInOptions()}
          {challenge.allowSelfCheckIn && (
            <button
              type="button"
              className="mt-2 font-nunito text-xs text-gray-500 underline"
              onClick={() => setCheckInMethod(checkInMethod === 'strava' ? 'self' : 'strava')}
            >
              {checkInMethod === 'strava'
                ? 'Use manual check-in instead'
                : 'Use Strava check-in instead'}
            </button>
          )}
        </>
      )}

      {/* if user already finish, always allow going to the claim page */}
      {challenge.status === UserChallengeStatus.Claimable && (
        <Button
          type="button"
          color="primary"
          className="mt-12 min-h-12 w-3/4 max-w-56"
          onClick={() => push(`/habit/claim/${challenge.id}`)}
        >
          Finish 🎉
        </Button>
      )}

      {/* challenge is not finished yet but can't check in now */}
      {challenge.status !== UserChallengeStatus.NotJoined && !canCheckInNow && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <Button
            className="mt-4 min-h-12 w-3/4 max-w-56"
            color="primary"
            variant="flat"
            onClick={handleChallengeListClick}
          >
            Back to List
          </Button>
          <div className="text-center text-xs text-default-400">
            {challengeStarted ? 'Challenge has Ended' : 'Challenge has not Started'}
          </div>
        </div>
      )}

      {challenge && address && (
        <Leaderboard userRankings={challenge.joinedUsers} address={address} challenge={challenge} />
      )}

      {isCheckinPopupOpen && (
        <CheckinPopup
          challenge={challenge}
          checkedIn={challenge.checkedIn}
          onClose={handleCloseCheckinPopup}
          onCheckInPageClick={handleChallengeListClick}
          lastCheckedInActivity={lastCheckedInActivity}
        />
      )}
    </div>
  );
}
