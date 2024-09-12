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
          <UserChallengesProvider>{children}</UserChallengesProvider>
        </AllChallengesProvider>
      </PasskeyProvider>
    </OnchainProviders>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <ChallengeDataProviders>{children}</ChallengeDataProviders>
    </NextUIProvider>
  );
}
