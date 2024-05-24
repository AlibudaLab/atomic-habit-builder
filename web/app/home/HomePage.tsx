'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import Header from '../habit/components/Header';
import { useAccount } from 'wagmi';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';
export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges, loading } = useUserChallenges(address);

  const router = useRouter();

  // go to the list page if no challenges (first time user)
  useEffect(() => {
    if (address && !loading && challenges.length === 0) {
      router.push('/habit/list');
    }
  }, [address, loading, challenges, router]);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="flex flex-col items-center justify-center">
        {!address ? <Onboard /> : <Dashboard onGoingChallenges={challenges} />}
      </div>
    </main>
  );
}
