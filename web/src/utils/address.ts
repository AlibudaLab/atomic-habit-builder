import { base, baseSepolia } from 'viem/chains';

/**
 * getSlicedAddress returns the first 5 and last 4 characters of an address.
 */
export const getSlicedAddress = (address: `0x${string}` | undefined, chars = 4) => {
  if (!address) {
    return '';
  }
  return `${address.slice(0, chars + 1)}...${address.slice(-chars)}`;
};

export const getExplorerLink = (address: `0x${string}` | undefined, chainId: number) => {
  if (!address) {
    return '';
  }
  if (chainId === baseSepolia.id) {
    return `https://sepolia.basescan.org/address/${address}`;
  }
  if (chainId === base.id) {
    return `https://basescan.io/address/${address}`;
  }
  return '';
};
