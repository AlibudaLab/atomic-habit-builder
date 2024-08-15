import { baseSepolia, Chain, base } from 'viem/chains';
import { Environment, getCurrentEnvironment } from './environment';

// The list of supported Chains for a given environment
export const SUPPORTED_CHAIN: Record<Environment, Chain> = {
  [Environment.localhost]: baseSepolia,
  [Environment.testnet]: baseSepolia,
  [Environment.mainnet]: base,
};

/**
 * Gets the list of supported chains for a given environment.
 * Defaults to the current environment.
 * @param env
 */
export function getChainsForEnvironment(env?: Environment) {
  if (!env) {
    env = getCurrentEnvironment();
  }
  return SUPPORTED_CHAIN[env];
}
