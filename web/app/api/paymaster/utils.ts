import { ENTRYPOINT_ADDRESS_V06, UserOperation } from 'permissionless';

export async function willSponsor({
  chainId,
  entrypoint,
}: {
  chainId: number;
  entrypoint: string;
  userOp: UserOperation<'v0.7'>;
}) {
  if (entrypoint.toLowerCase() !== ENTRYPOINT_ADDRESS_V06.toLowerCase()) return false;

  return true;
}
