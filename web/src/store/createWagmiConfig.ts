import { createConfig, http } from 'wagmi';
import { passkeyConnector } from '@alibuda/zerodev-wallet';
import { getChainsForEnvironment } from './supportedChains';
import { WebAuthnMode } from '@zerodev/passkey-validator';

const chain = getChainsForEnvironment();

const zerodevUrl = `https://passkeys.zerodev.app/api/v4`;

export function createWagmiConfig(rpcUrl: string, zerodevApiKey: string) {
  return createConfig({
    chains: [chain],
    connectors: [
      passkeyConnector(
        zerodevApiKey,
        chain,
        'v3.1',
        'atomic',
        zerodevUrl,
        'register' as WebAuthnMode,
      ), // connector[0] for register only

      passkeyConnector(
        zerodevApiKey,
        chain,
        'v3.1',
        'atomic',
        zerodevUrl,
        'login' as WebAuthnMode,
      ), // connector[1] for login
    ],

    transports: {
      [chain.id]: http(rpcUrl),
    },
  });
}
