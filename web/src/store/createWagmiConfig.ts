import { createConfig, http } from 'wagmi';
import { getChainsForEnvironment } from './supportedChains';
import { arbitrum, arbitrumSepolia } from 'viem/chains';

const chain = getChainsForEnvironment();

export function createWagmiConfig(rpcUrl: string, zerodevApiKey: string) {
  return createConfig({
    chains: [chain, arbitrumSepolia, arbitrum],
    transports: {
      [chain.id]: http(rpcUrl),
      [arbitrumSepolia.id]: http('https://arbitrum-sepolia.blockpi.network/v1/rpc/public'),
      [arbitrum.id]: http(),
    },
  });
}
