'use client';

import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';
import { useRouter, useSearchParams } from 'next/navigation';
import CardSlider from '../../../src/components/CardSlider/CardSlider';

/**
 * For first time visitor (not-logged in) to the app!
 * @returns
 */
export default function Onboard() {
  // if referral link is attached in the URL (newly opened), show register modal
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');

  const defaultShowRegister = referralCode !== null && referralCode !== undefined;

  return (
    <main className="container mx-6 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <p className="mx-6 pt-4 font-londrina text-lg"> Stake to join a challenge. </p>
        <p className="mx-6 pb-8 font-londrina text-lg">Earn rewards by building a habit. </p>

        <CardSlider />

        <SignInAndRegister defaultShowRegister={defaultShowRegister} />
      </div>
    </main>
  );
}
