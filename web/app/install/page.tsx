'use client';

import InstallPWA from './components/InstallButton';

export default function DashboardPage() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <p className="pb-20 text-center font-londrina text-xl font-bold">
        {' '}
        Build habits, track progress, and earn rewards{' '}
      </p>

      <InstallPWA />
    </main>
  );
}
