'use client';

import Header from '../../components/Header';
import useAllChallenges from '@/hooks/useAllChallenges';
import Link from 'next/link';
import { ChallengeBox } from '../../components/ChallengeBox';
import { useAccount } from 'wagmi';
import useUserChallenges from '@/hooks/useUserChallenges';
import Loading from '../../components/Loading';

export default function ChallengeList() {
  const { address } = useAccount();

  const { challenges, loading: loadingAllChallenges } = useAllChallenges();

  const { data: joined, loading: loadingUserData } = useUserChallenges(address);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 text-center">
      <div className="flex flex-col items-center justify-center">
        <p className="pb-4 text-center font-londrina text-xl font-bold"> Join a Challenge Now! </p>

        {/* Challenge List */}
        {loadingUserData || loadingAllChallenges ? (
          <Loading />
        ) : (
          <div className="pt-4">
            {challenges.map((challenge) => {
              const isJoined = joined?.find((j) => j.id === challenge.id);
              if (!isJoined)
                return (
                  <Link
                    className="w-full no-underline"
                    key={challenge.id.toString()}
                    href={`/habit/stake/${challenge.id}`}
                  >
                    <ChallengeBox challenge={challenge} />
                  </Link>
                );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
