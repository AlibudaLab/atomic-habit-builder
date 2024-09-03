import { P } from '@/components/layout/guide';
import { ChallengeTypes } from '@/constants';
import { UserChallengeStatus } from '@/types';
import { Challenge, ChallengeWithCheckIns, UserStatus } from '@/types';
import moment from 'moment';

export function challengeToEmoji(type: ChallengeTypes) {
  switch (type) {
    case ChallengeTypes.Run:
      return '🏃';
    case ChallengeTypes.Workout:
      return '💪';
    case ChallengeTypes.Cycling:
      return '🚴';
    case ChallengeTypes.NFC_Chip:
      return '💚';
  }
}

export function getCheckInDescription(type: ChallengeTypes) {
  switch (type) {
    case ChallengeTypes.Run:
      return 'Check in with connected run activity on Strava.';
    case ChallengeTypes.Workout:
      return 'Check in with connected workout activity on Strava.';
    case ChallengeTypes.Cycling:
      return 'Check in with connected cycling activity on Strava.';
    case ChallengeTypes.NFC_Chip:
      return 'Check in by tapping onto the target NFC Chip.';
  }
}

export function getChallengeUnit(type: ChallengeTypes) {
  switch (type) {
    case ChallengeTypes.Run:
      return 'runs';
    case ChallengeTypes.Workout:
      return 'workouts';
    case ChallengeTypes.Cycling:
      return 'rides';
    case ChallengeTypes.NFC_Chip:
      return 'times';
  }
}

export function getUserChallengeStatus(
  userStatus: UserStatus,
  checkedIn: number,
  challenge: Challenge,
) {
  const now = moment().unix();

  if (userStatus === UserStatus.NotExist) {
    return UserChallengeStatus.NotJoined;
  }

  if (challenge.startTimestamp > now) {
    return UserChallengeStatus.NotStarted;
  }
  if (checkedIn >= challenge.minimumCheckIns) {
    if (challenge.endTimestamp > now) {
      return UserChallengeStatus.Completed;
    }

    if (userStatus === UserStatus.Claimed) {
      return UserChallengeStatus.Claimed;
    }

    return UserChallengeStatus.Claimable;
  } else {
    // user checkin < target amount
    if (challenge.endTimestamp > now) {
      return UserChallengeStatus.Ongoing;
    }

    return UserChallengeStatus.Failed;
  }
}
