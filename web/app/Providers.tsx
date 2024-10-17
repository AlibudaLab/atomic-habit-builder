'use client';

import './global.css';
import { NextUIProvider } from '@nextui-org/system';
import { AuthKitProvider } from '@farcaster/auth-kit';
import { AllChallengesProvider } from '@/providers/ChallengesProvider';
import { UserChallengesProvider } from '@/providers/UserChallengesProvider';
import { PasskeyProvider } from '@/providers/PasskeyProvider';
import OnchainProviders from '@/OnchainProviders';
import { UserProfileProvider } from '@/providers/UserProfileProvider';

const config = {
  rpcUrl: 'https://mainnet.optimism.io',
  domain: 'alibuda.meme',
  siweUri: 'https://alibuda.meme',
  relay: 'https://relay.farcaster.xyz',
};

function ChallengeDataProviders({ children }: { children: React.ReactNode }) {
  return (
    <OnchainProviders>
      <AuthKitProvider config={config}>
        <PasskeyProvider>
          <UserProfileProvider>
            <AllChallengesProvider>
              <UserChallengesProvider>{children}</UserChallengesProvider>
            </AllChallengesProvider>
          </UserProfileProvider>
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
