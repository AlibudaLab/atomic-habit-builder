'use client';

import { ConnectButton } from '@/components/Connect/ConnectButton';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';

/**
 * For first time visitor (not-logged in) to the app!
 * @returns
 */
export default function Onboard() {
  const { push } = useRouter();

  return (
    <main className="container mx-6 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <SubTitle text="Welcome to Atomic" />

        <p className="mx-4 pb-4 pt-12 font-nunito text-sm">Stake, commit, and track your habits.</p>

        <SignInAndRegister />
      </div>
    </main>
  );
}
