'use client';

import { useParams } from 'next/navigation';
import RunCheckIn from './checkinRun';
import Loading from 'app/habit/components/Loading';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { useChallengeWithCheckIns } from '@/hooks/useChallengeWithCheckIns';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';

export default function CheckIn() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { challenge, loading } = useChallengeWithCheckIns(Number(challengeId));

  return (
    <div className="flex h-screen w-full flex-col items-center">
      <SubTitle text="Happy Builder; Habit Builder!" />

      {loading ? (
        <Loading />
      ) : challenge ? (
        <RunCheckIn challenge={challenge} />
      ) : (
        <SignInAndRegister />
      )}
    </div>
  );
}
