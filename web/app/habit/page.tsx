'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from './components/Onboard';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

export default function DashboardPage() {

  const address = '0xBAbe69e7F2C7A9f0369Ae934865d0097B73543Fc'

  const { data: challenges } = useUserChallenges(address);


  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      
      <div className="flex flex-col items-center justify-center">
        {!address ? (
          <Onboard />
        ) : (
          <Dashboard challenges={challenges}/>
        )}
      </div>
  
    </main>
  );
}
