'use client';

import './global.css';
import { NextUIProvider } from '@nextui-org/system';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { AllChallengesProvider } from '@/providers/ChallengesProvider';
import { UserChallengesProvider } from '@/providers/UserChallengesProvider';
import { PasskeyProvider } from '@/providers/PasskeyProvider';
import OnchainProviders from '@/OnchainProviders';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'alibuda.meme',
  siweUri: 'https://alibuda.meme',
};

function ChallengeDataProviders({ children }: { children: React.ReactNode }) {
  return (
    <OnchainProviders>
      <AuthKitProvider config={config}>
        <PasskeyProvider>
          <AllChallengesProvider>
            <UserChallengesProvider>{children}</UserChallengesProvider>
          </AllChallengesProvider>
        </PasskeyProvider>
      </AuthKitProvider>
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
