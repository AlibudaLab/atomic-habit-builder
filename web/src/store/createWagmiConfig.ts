import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet } from 'wagmi/connectors';

export function createWagmiConfig(rpcUrl: string, projectId?: string) {
  // Keep this till we fully deprecated RK inside the template
  if (projectId) {
    console.log('projectId:', projectId);
  }

  const baseUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base/');
  const baseSepoliaUrl = rpcUrl.replace(/\/v1\/(.+?)\//, '/v1/base-sepolia/');

  return createConfig({
    chains: [baseSepolia],
    connectors: [
      coinbaseWallet({
        appName: 'Alibuda',
        appChainIds: [baseSepolia.id],
        preference: 'smartWalletOnly',
      }),
    ],
    ssr: true,
    transports: {
      [baseSepolia.id]: http(baseSepoliaUrl),
      [base.id]: http(baseUrl),
    },
  });
}
