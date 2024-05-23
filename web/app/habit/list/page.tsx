'use client';

import Header from '../components/Header';
import useAllChallenges from '@/hooks/useAllChallenges';
import Link from 'next/link';
import { ChallengeBox } from '../components/ChallengeBox';

export default function ChallengeList() {
  const { challenges } = useAllChallenges();

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16 text-center">
      <Header />

      <div className="flex flex-col items-center justify-center">
        <p className="text-center text-lg"> Choose a challenge </p>

        {/* Challenge List */}
        <div className="pt-4">
          {challenges.map((challenge) => (
            <Link
              className="w-full no-underline"
              key={challenge.id.toString()}
              href={`/habit/stake/${challenge.id}`}
            >
              <ChallengeBox challenge={challenge} />
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
