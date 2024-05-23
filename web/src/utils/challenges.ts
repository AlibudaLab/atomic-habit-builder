import { ChallengeTypes } from '@/constants';

export function challengeToEmoji(type: ChallengeTypes) {
  switch (type) {
    case ChallengeTypes.Run:
      return '🏃';
    case ChallengeTypes.Workout:
      return '💪';
    case ChallengeTypes.NFC_Chip:
      return '💚';
  }
}

export function getCheckInDescription(type: ChallengeTypes) {
  switch (type) {
    case ChallengeTypes.Run:
      return 'Check in with connected run activity on Strava. It can be both indoor or outdoor run.';
    case ChallengeTypes.Workout:
      return 'Check in with connected Workout activity on Strava';
    case ChallengeTypes.NFC_Chip:
      return 'Check in by tapping onto the target NFC Chip';
  }
}