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
import { Button, ButtonGroup } from '@nextui-org/react';
import InviteLink from 'app/habit/components/InviteLink';
import { ConnectButton } from '@/components/Connect/ConnectButton';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import Leaderboard from 'app/habit/components/Leaderboard';
import { logEventSimple } from '@/utils/gtag';
import SelfCheckInButton from './SelfCheckInButton';

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
  const [selfCheckedIn, setSelfCheckedIn] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [checkInMethod, setCheckInMethod] = useState<'strava' | 'self'>('strava');

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
    loading: stravaLoading,
  } = useStravaData(challenge);

  // sign when address and activityId are ready (chosen)
  useEffect(() => {
    if (!address || (!selfCheckedIn && chosenActivityId === 0)) return;

    const id = selfCheckedIn ? moment().unix() : chosenActivityId;

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
  }, [address, chosenActivityId, challenge.id, setField, selfCheckedIn]);

  // only show this button if user is not connected to strava
  const onClickConnectStrava = useCallback(() => {
    logEventSimple({ eventName: 'click_connect_strava', category: 'challenge' });
    // path that user will be redirected to after connecting to strava
    const redirectUri = window.origin + '/connect-run/strava';

    // after verification on the connect-run/strava page, direct back to this page
    const authUrl = stravaUtils.getAuthURL(redirectUri, window.location.href);
    window.location = authUrl as any;
  }, []);

  const activitiesToUse: stravaUtils.StravaData[] =
    challenge.type === ChallengeTypes.Workout
      ? workoutData
      : challenge.type === ChallengeTypes.Cycling
      ? cyclingData
      : runData;

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

  const onClickCheckIn = async () => {
    if (checkInMethod === 'strava' && fields.activityId === 0) {
      toast.error('Please select an activity');
      return;
    }
    onCheckInTx();
  };

  const renderCheckInOptions = () => {
    if (!canCheckInNow) return null;

    return (
      <div className="flex w-full flex-col items-center justify-center">
        <ButtonGroup className="mb-4">
          <Button
            className="text-xs"
            color={checkInMethod === 'strava' ? 'primary' : 'default'}
            variant="flat"
            onClick={() => setCheckInMethod('strava')}
          >
            Strava
          </Button>
          <Button
            className="text-xs"
            color={checkInMethod === 'self' ? 'primary' : 'default'}
            onClick={() => setCheckInMethod('self')}
            variant="flat"
            isDisabled={!challenge.allowSelfCheckIn}
          >
            Self Check-In
          </Button>
        </ButtonGroup>
        <div className="w-full max-w-md items-center justify-center">
          {' '}
          {/* Set a max width for consistency */}
          {checkInMethod === 'strava' ? (
            verifierConnected ? (
              <ActivityDropDown
                isDisabled={!address}
                fields={fields}
                onActivitySelect={setChosenActivityId}
                loading={stravaLoading}
                activities={activitiesToUse}
                usedActivities={activityMap[challenge.id]}
              />
            ) : (
              <Button
                type="button"
                color="primary"
                className="w-full"
                onClick={onClickConnectStrava}
              >
                Connect with Strava
              </Button>
            )
          ) : (
            <SelfCheckInButton
              setCheckedIn={setSelfCheckedIn}
              isDisabled={isCheckInLoading || isSigning}
              challengeType={challenge.type}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen w-full flex-col items-center px-4 text-center">
      {/* overview   */}
      <div className="my-4 w-full">
        <ChallengePreview challenge={challenge} fullWidth checkedIn={challenge.checkedIn} />
      </div>

      {/* goal description */}
      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-base font-bold text-dark"> Description </div>
        <div className="text-sm text-primary"> {challenge.description} </div>
      </div>

      <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-base font-bold text-dark"> Staked Amount </div>
        <div className="flex text-sm text-primary">
          {`${formatUnits(challenge.stake, 6)} USDC`}{' '}
        </div>
      </div>

      {/* <div className="w-full justify-start p-6 py-2 text-start">
        <div className="text-xl font-bold text-dark"> Invite Others </div>
        <InviteLink accessCode={challenge.accessCode} challengeId={challenge.id} />
      </div> */}

      <div className="m-4 text-center font-londrina text-base">
        ⏰ Challenge {challenge.endTimestamp > now() / 1000 ? 'settles' : 'settled'}{' '}
        {moment.unix(challenge.endTimestamp).fromNow()}
      </div>

      {/* middle section: if timestamp is not valid, show warning message */}

      {/* no address detected: ask user to connect */}
      {!address && <ConnectButton className="w-3/4" />}

      {challenge.status === UserChallengeStatus.Ongoing && canCheckInNow && renderCheckInOptions()}

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

      {/* challenge is not finished yet */}
      {challenge.status !== UserChallengeStatus.NotJoined &&
        (canCheckInNow ? (
          <Button
            type="button"
            color="primary"
            className="mt-2 min-h-12 w-3/4 max-w-56"
            onClick={onClickCheckIn}
            isDisabled={
              isCheckInLoading ||
              isSigning ||
              (checkInMethod === 'strava' && chosenActivityId === 0) ||
              (checkInMethod === 'self' && !selfCheckedIn)
            }
            isLoading={isCheckInLoading || isSigning}
          >
            Check In
          </Button>
        ) : (
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
        ))}

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
