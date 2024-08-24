'use client';

import { ConnectButton } from '@/components/ConnectButton/ConnectButton';
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

        <p className="mx-4 pb-4 pt-12 font-nunito text-sm">
          Connect your account or explore live challenges!
        </p>

        {/* two buttons  */}
        <div className="flex w-full gap-2 pt-8">
          <Button className="min-h-12 w-1/2 no-underline" onClick={() => push('/habit/list')}>
            <div className="my-4 rounded-lg p-4">Explore</div>
          </Button>
          <ConnectButton className="w-1/2" primary />
        </div>
      </div>
    </main>
  );
}
