'use client';

import Header from '../habit/components/Header';
import { useAccount } from 'wagmi';
import InstallPWA from './components/InstallButton';

export default function DashboardPage() {
  const { address } = useAccount();

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />
      
      <p className="text-center font-londrina text-xl font-bold pb-20"> Build habits, track progress, and earn rewards </p>

      
      <InstallPWA />
      
    </main>
  );
}
