import { useMemo } from 'react';
import { Challenge } from '@/types';
import { useAllChallenges } from '@/providers/ChallengesProvider';

const useFilteredChallenges = (publicOnly: boolean, connectedUser: string | undefined) => {
  const { challenges, loading } = useAllChallenges();

  const filteredChallenges = useMemo(
    () =>
      challenges.filter((c) => {
        if (publicOnly) {
          return c?.public || c?.creator === connectedUser;
        } else {
          return true;
        }
      }),
    [challenges, connectedUser],
  );

  return { filteredChallenges, loading };
};

export default useFilteredChallenges;
