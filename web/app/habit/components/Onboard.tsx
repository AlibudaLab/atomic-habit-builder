'use client';

import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';
import { useRouter } from 'next/navigation';
import CardSlider from '../../../src/components/CardSlider/CardSlider';

/**
 * For first time visitor (not-logged in) to the app!
 * @returns
 */
export default function Onboard() {
  const { push } = useRouter();

  return (
    <main className="container mx-6 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <p className="mx-6 pt-4 font-londrina text-lg"> Stake to join a challenge. </p>
        <p className="mx-6 pb-8 font-londrina text-lg">Earn rewards by building a habit. </p>

        <CardSlider />

        <SignInAndRegister />
      </div>
    </main>
  );
}
