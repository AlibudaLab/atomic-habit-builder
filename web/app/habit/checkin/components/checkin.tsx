'use client';

import { useParams } from 'next/navigation';
import ActivityCheckIn from './ActivityCheckIn';
import Loading from 'app/habit/components/Loading';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { useChallengeWithCheckIns } from '@/hooks/useChallengeWithCheckIns';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';

export default function CheckIn() {
  const params = useParams();
  const challengeId = params?.challengeId;
  const { challenge, loading } = useChallengeWithCheckIns(
    challengeId ? Number(challengeId) : undefined,
  );

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <SubTitle text="Happy Builder; Habit Builder!" />

      {loading ? (
        <Loading />
      ) : challenge ? (
        <ActivityCheckIn challenge={challenge} />
      ) : (
        <SignInAndRegister />
      )}
    </div>
  );
}
