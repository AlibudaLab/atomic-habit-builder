'use client';

import './global.css';

import OnchainProviders from '@/OnchainProviders';
import { AllChallengesProvider } from '@/providers/ChallengesProvider';
import { UserChallengesProvider } from '@/providers/UserChallengesProvider';
import { NextUIProvider } from '@nextui-org/system';
import { useAccount } from 'wagmi';

function ChallengeDataProviders({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();

  return (
    <AllChallengesProvider>
      <UserChallengesProvider address={address}>{children}</UserChallengesProvider>
    </AllChallengesProvider>
  );
}

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainProviders>
      <NextUIProvider>
        <ChallengeDataProviders>{children}</ChallengeDataProviders>
      </NextUIProvider>
    </OnchainProviders>
  );
}
