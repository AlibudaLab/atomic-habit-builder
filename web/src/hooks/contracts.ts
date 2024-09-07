import { Abi, Address, type Chain } from 'viem';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { getChainsForEnvironment } from '@/store/supportedChains';

type ContractInstance = {
  chain: Chain;
  address: Address;
  deactivated?: boolean;
};

export type UseContractReturn<T extends Abi> = { abi: T; supportedChains: Chain[] } & (
  | { address: Address; status: 'ready' }
  | { status: 'onUnsupportedNetwork' }
  | { status: 'deactivated' }
);

type Spec<T extends Abi> = {
  abi: T;
  [chainId: number]: ContractInstance;
};

const accountChain = getChainsForEnvironment();

/**
 * Generates a hook that returns contract data based on the current network.
 */
export function generateContractHook<T extends Abi>({ abi, ...spec }: Spec<T>) {
  function useContract(): UseContractReturn<typeof abi> {
    const supportedChains = Object.values(spec).map((s) => s.chain);

    // use a supported chain available in current env as fallback
    const chain =
      accountChain ??
      supportedChains.find((supportedChain) => getChainsForEnvironment().id === supportedChain.id);

    if (chain && chain.id in spec) {
      if (spec[chain.id].deactivated) {
        return { abi, status: 'deactivated', supportedChains };
      }

      return {
        abi,
        address: spec[chain.id].address,
        status: 'ready',
        supportedChains,
      };
    }

    return {
      abi,
      status: 'onUnsupportedNetwork',
      supportedChains,
    };
  }

  return useContract;
}
