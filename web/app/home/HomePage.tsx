'use client'

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import Header from '../habit/components/Header';
import { useAccount } from 'wagmi';

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';
export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges } = useUserChallenges(address);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <GetSingleTrait properties={{ name: 'Nouns Logo', glasses: -2, width: 163, height: 62 }} />

      <Header />

      <div className="flex flex-col items-center justify-center">
        {!address ? <Onboard /> : <Dashboard onGoingChallenges={challenges} />}
      </div>
    </main>
  );
}
