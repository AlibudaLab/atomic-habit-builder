'use client';

import { useAllChallenges } from '@/providers/ChallengesProvider';
import { ChallengeBox } from '../../components/ChallengeBox';
import { useAccount } from 'wagmi';
import useUserChallenges from '@/hooks/useUserChallenges';
import Loading from '../../components/Loading';
import moment from 'moment';
import { useRouter } from 'next/navigation';

export default function ChallengeList() {
  const { address } = useAccount();

  // only fetch public challenges
  const { challenges, loading: loadingAllChallenges } = useAllChallenges();

  const { data: joined, loading: loadingUserData } = useUserChallenges(address);

  const { push } = useRouter();

  return (
    <main className="container flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <p className="pb-8 text-center font-londrina text-xl font-bold"> Join a Challenge Now! </p>

        {/* Challenge List */}
        {loadingUserData || loadingAllChallenges ? (
          <Loading />
        ) : (
          challenges.map((challenge) => {
            const isJoined = joined?.find((j) => j.id === challenge.id);
            const notEnded = challenge.endTimestamp > moment().unix();
            if (!isJoined && notEnded)
              return (
                <button
                  type="button"
                  className="m-2 w-full no-underline"
                  key={challenge.id.toString()}
                  onClick={() => push(`/habit/stake/${challenge.id}`)}
                >
                  <ChallengeBox challenge={challenge} fullWidth />
                </button>
              );
          })
        )}
      </div>
    </main>
  );
}
