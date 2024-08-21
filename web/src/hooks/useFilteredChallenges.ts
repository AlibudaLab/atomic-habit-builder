import { useMemo } from 'react';
import { Challenge } from '@/types';
import { useAllChallenges } from '@/providers/ChallengesProvider';

const useFilteredChallenges = (publicOnly: boolean, connectedUser: string | undefined) => {
  const { challenges } = useAllChallenges();

  const filteredChallenges = useMemo(
    () =>
      challenges.filter((c) => {
        if (publicOnly) {
          return c?.public || c?.creator === connectedUser;
        } else {
          return true;
        }
      }),
    [challenges],
  );

  return { filteredChallenges };
};

export default useFilteredChallenges;
