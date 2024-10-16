import { ChallengeWithCheckIns } from '@/types';

export type SortOption = 'status' | 'stakes' | 'startTimestamp' | 'endTimestamp';

export const sortChallenges = (challenges: ChallengeWithCheckIns[], sortBy: SortOption) => {
  return [...challenges].sort((a, b) => {
    switch (sortBy) {
      case 'stakes':
        return Number(b.stake) - Number(a.stake);
      case 'startTimestamp':
        return a.startTimestamp - b.startTimestamp;
      case 'endTimestamp':
        return a.endTimestamp - b.endTimestamp;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });
};
