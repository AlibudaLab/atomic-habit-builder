'use client';

import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { randomChoice } from '@/utils/content';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

/**
 * For first time visitor (not-logged in) to the app!
 * @returns
 */
export default function Onboard() {
  const { push } = useRouter();

  const content = useMemo(() => {
    return randomChoice([
      'Ready to put your money where your habits are? Connect now!',
      'No pain, no gain... no check-in, no coin.',
      'Stakes are high, rewards are higher. Connect and commit.',
      'Your habits or your USDC – which will last longer? Join to find out.',
      'Warning: Connection may lead to life improvement and potential profits.',
    ]);
  }, []);

  return (
    <main className="container mx-6 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <SubTitle text="Welcome to Atomic" />

        <p className="mx-6 pb-4 pt-12 font-nunito text-sm">{content}</p>

        <SignInAndRegister />
      </div>
    </main>
  );
}
