import { useUserChallenges } from '@/providers/UserChallengesProvider';
import { UserChallengeStatus } from '@/types';
import { useMemo } from 'react';

export function useUserStatus(id: number) {
  const { data: challenges, loading } = useUserChallenges();

  const status = useMemo(() => {
    const challenge = challenges?.find((c) => c.id === id);
    if (!challenge) return UserChallengeStatus.NotJoined;
    else return challenge.status;
  }, []);

  const joined = useMemo(() => status !== UserChallengeStatus.NotJoined, [status]);

  return { status, joined, loading };
}
