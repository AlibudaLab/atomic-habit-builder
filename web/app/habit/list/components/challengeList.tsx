'use client';

import { useAllChallenges } from '@/providers/ChallengesProvider';
import { ChallengeBox } from '../../components/ChallengeBox';
import { useAccount } from 'wagmi';
import useUserChallenges from '@/hooks/useUserChallenges';
import Loading from '../../components/Loading';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function ChallengeList() {
  const { address } = useAccount();

  const { challenges: allChallenges, loading: loadingChallenges } = useAllChallenges();
  const challenges = useMemo(
    () => allChallenges.filter((c) => c?.public || c?.creator === address ),
    [allChallenges],
  );

  const { data: joined, loading: loadingUserData } = useUserChallenges(address);

  const { push } = useRouter();

  return (
    <main className="container flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <p className="pb-8 text-center font-londrina text-xl font-bold"> Join a Challenge Now! </p>

        {/* Challenge List */}
        {loadingUserData || loadingChallenges ? (
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
