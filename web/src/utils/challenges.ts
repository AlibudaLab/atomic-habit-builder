import { ChallengeTypes } from '@/constants';
import { UserChallengeStatus } from '@/types';
import { Challenge, UserStatus } from '@/types';
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

const baseDescriptions = {
  [ChallengeTypes.Run]: 'Complete a run and sync with Strava',
  [ChallengeTypes.Workout]: 'Complete a workout and sync with Strava',
  [ChallengeTypes.Cycling]: 'Complete a cycling activity and sync with Strava',
  [ChallengeTypes.NFC_Chip]: 'N/A',
};

export function getCheckInDescription(type: ChallengeTypes, allowSelfCheckIn?: boolean): string {
  const baseDescription = baseDescriptions[type];

  if (allowSelfCheckIn) {
    return `${baseDescription}, or manually record your activity.`;
  }

  return baseDescription;
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
  { startTimestamp, endTimestamp, minimumCheckIns }: Challenge,
): UserChallengeStatus {
  const now = moment().unix();
  if (userStatus === UserStatus.NotExist) return UserChallengeStatus.NotJoined;
  if (now < startTimestamp) return UserChallengeStatus.NotStarted;

  const isCompleted = checkedIn >= minimumCheckIns;
  const isOngoing = now <= endTimestamp;

  if (isCompleted) {
    if (isOngoing) return UserChallengeStatus.Completed;
    return userStatus === UserStatus.Claimed
      ? UserChallengeStatus.Claimed
      : UserChallengeStatus.Claimable;
  }
  return isOngoing ? UserChallengeStatus.Ongoing : UserChallengeStatus.Failed;
}
