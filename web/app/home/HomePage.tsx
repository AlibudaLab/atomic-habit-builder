'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from '../habit/components/Onboard';
import Dashboard from '../habit/components/UserDashboard';
import Header from '../habit/components/Header';
import { useAccount } from 'wagmi';
import Loading from 'app/habit/components/Loading';
import ChallengeList from 'app/habit/list/components/challengeList';
import NavbarFooter from 'app/habit/components/NavbarFooter';

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges, loading } = useUserChallenges(address);

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16 pb-[64px]">
      <Header />
      {!address ? (
        <Onboard />
      ) : loading ? (
        <Loading />
      ) : challenges.length === 0 ? (
        <ChallengeList />
      ) : (
        <Dashboard onGoingChallenges={challenges} />
      )}
      <NavbarFooter />
    </main>
  );
}
