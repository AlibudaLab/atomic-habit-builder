import { Address } from 'viem';

import { usdcContractAddrs } from '@/constants';
import { base } from 'viem/chains';
const usdc = usdcContractAddrs[base.id];

export function getBridgePageLink(address: Address) {
  // temporarily, only able to open the bridge page directly if specify "app/daimo"
  // will update the path once
  return `https://www.relay.link/app/daimo?toChainId=${base.id}&toCurrency=${usdc}&lockToToken=true&toAddress=${address}`;
}
