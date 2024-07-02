import { ENTRYPOINT_ADDRESS_V06, UserOperation } from 'permissionless';
import { baseSepolia } from 'viem/chains';

export async function willSponsor({
  chainId,
  entrypoint,
}: {
  chainId: number;
  entrypoint: string;
  userOp: UserOperation<'v0.7'>;
}) {
  console.log('chainId', Number(chainId), baseSepolia.id);

  if (Number(chainId) !== baseSepolia.id) return false;

  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) return false;

  return true;
}
