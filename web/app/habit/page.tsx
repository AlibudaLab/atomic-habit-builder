'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from './components/Onboard';
import Dashboard from './components/UserDashboard';
import Header from './components/Header';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges } = useUserChallenges(address);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="flex flex-col items-center justify-center">
        {!address ? <Onboard /> : <Dashboard onGoingChallenges={challenges} />}
      </div>
    </main>
  );
}
