
import { useAllChallenges } from '@/providers/ChallengesProvider';

const useChallenge = (id: number) => {
  
  const { challenges, loading, refetch } = useAllChallenges();

  const challenge = challenges?.find((c) => c.id === id);

  return { loading, challenge, refetch };
};

export default useChallenge;
