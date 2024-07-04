'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@/store/createWagmiConfig';

type Props = { children: ReactNode };
const queryClient = new QueryClient();

const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL ?? '';
const zerodevApiKey = process.env.NEXT_PUBLIC_ZERODEV_API_KEY ?? '';

if (!rpcUrl || !zerodevApiKey) {
  const rpcErrMessage =
    'Missing RPC URL or ZeroDev API Key. Please check your environment variables.';
  throw new Error(rpcErrMessage);
}
const wagmiConfig = createWagmiConfig(rpcUrl, zerodevApiKey);

/**
 * TODO Docs ~~~
 */
function OnchainProviders({ children }: Props) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;
export { wagmiConfig };
