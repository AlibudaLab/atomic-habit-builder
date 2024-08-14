import { createConfig, http } from 'wagmi';
import { passkeyConnector } from '@zerodev/wallet';
import { getChainsForEnvironment } from './supportedChains';

const chain = getChainsForEnvironment()[0];

export function createWagmiConfig(rpcUrl: string, zerodevApiKey: string) {
  return createConfig({
    chains: [chain],
    connectors: [passkeyConnector(zerodevApiKey, chain, 'v3', 'alibuda')],

    transports: {
      [chain.id]: http(rpcUrl),
    },
  });
}
