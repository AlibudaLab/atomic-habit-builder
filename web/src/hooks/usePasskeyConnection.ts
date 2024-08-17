'use client';

import storage from 'local-storage-fallback';
import { useMemo } from 'react';
import { useConnect } from 'wagmi';

export default function usePasskeyConnection() {
  const { connectors, connect, isPending } = useConnect();

  const signedInBefore = useMemo(() => storage.getItem('zerodev_wallet_signer') !== null, []);

  return {
    signedInBefore,
    register: () => connect({ connector: connectors[0] }),
    login: () => connect({ connector: connectors[1] }),
    isPending,
  };
}
