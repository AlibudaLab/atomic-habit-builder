import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { passkeyConnector } from '@zerodev/wallet';

export function createWagmiConfig(rpcUrl: string, zerodevApiKey: string) {
  const baseUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base/');
  const baseSepoliaUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base-sepolia/');

  return createConfig({
    chains: [baseSepolia],
    connectors: [passkeyConnector(zerodevApiKey, baseSepolia, 'v3', 'alibuda')],

    transports: {
      [baseSepolia.id]: http(baseSepoliaUrl),
      [base.id]: http(baseUrl),
    },
  });
}
