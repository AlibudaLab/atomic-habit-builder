'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import Header from '../habit/components/Header';
import { useAccount } from 'wagmi';
import Loading from 'app/habit/components/Loading';

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges, loading } = useUserChallenges(address);

  console.log('loading', loading);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-col items-center justify-center">
          {!address ? <Onboard /> : <Dashboard onGoingChallenges={challenges} />}
        </div>
      )}
    </main>
  );
}
