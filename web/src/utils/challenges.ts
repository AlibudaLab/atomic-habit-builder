import { ChallengeTypes } from "@/constants";

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