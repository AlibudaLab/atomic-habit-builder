import { Address } from 'viem';

import { usdcAddr, currentChainId } from '@/constants';

export function getBridgePageLink(address: Address) {
  return `https://www.relay.link/app?toChainId=${currentChainId}&toCurrency=${usdcAddr}&lockToToken=true&toAddress=${address}`;
}
