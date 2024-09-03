import { useUserChallenges } from '@/providers/UserChallengesProvider';

export function useChallengeWithCheckIns(id: number) {
  const { data: challenges, loading } = useUserChallenges();

  const challenge = challenges?.find((c) => c.id === id);

  return {
    challenge,
    loading,
  };
}
