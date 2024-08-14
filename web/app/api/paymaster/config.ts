import { createClient, http } from 'viem';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { paymasterActionsEip7677 } from 'permissionless/experimental';
import { getChainsForEnvironment } from '@/store/supportedChains';

const chain = getChainsForEnvironment();

// use the coinbase paymaster service (same as node rpc)
const paymasterService = process.env.NEXT_PUBLIC_RPC_URL;

export const paymasterClient = createClient({
  chain,
  transport: http(paymasterService),
}).extend(paymasterActionsEip7677(ENTRYPOINT_ADDRESS_V07));
