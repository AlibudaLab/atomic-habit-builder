'use client';

import './global.css';
import { NextUIProvider } from '@nextui-org/system';
import { AllChallengesProvider } from '@/providers/ChallengesProvider';
import { UserChallengesProvider } from '@/providers/UserChallengesProvider';
import { PasskeyProvider, usePasskeyAccount } from '@/providers/PasskeyProvider';
import OnchainProviders from '@/OnchainProviders';

function ChallengeDataProviders({ children }: { children: React.ReactNode }) {
  return (
    <OnchainProviders>
      <PasskeyProvider>
        <AllChallengesProvider>
          <PasskeyAwareUserChallengesProvider>{children}</PasskeyAwareUserChallengesProvider>
        </AllChallengesProvider>
      </PasskeyProvider>
    </OnchainProviders>
  );
}

function PasskeyAwareUserChallengesProvider({ children }: { children: React.ReactNode }) {
  const { address } = usePasskeyAccount();
  return <UserChallengesProvider address={address || undefined}>{children}</UserChallengesProvider>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ChallengeDataProviders>{children}</ChallengeDataProviders>
    </NextUIProvider>
  );
}
