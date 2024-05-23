'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from './components/Onboard';
import Dashboard from './components/UserDashboard';
import Header from './components/Header';
import { useAccount } from 'wagmi';

export default function DashboardPage() {
  const { address } = useAccount();

  const { data: challenges, loading } = useUserChallenges(address);

  // go to the list page if no challenges (first time user)
  // useEffect(() => {
  //   if (address && !loading && challenges.length === 0) {
  //     router.push('/habit/list')
  //   }
  // }, [address, loading, challenges, router])

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <div className="flex flex-col items-center justify-center">
        {!address ? <Onboard /> : <Dashboard onGoingChallenges={challenges} />}
      </div>
    </main>
  );
}
