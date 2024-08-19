'use client';

import storage from 'local-storage-fallback';
import { useEffect, useMemo, useState } from 'react';
import { useConnect } from 'wagmi';

export default function usePasskeyConnection() {
  const { connectors, connect, isPending } = useConnect();
  const [initializing, setInitializing] = useState(true);
  const [signedInBefore, setSignedInBefore] = useState(false);

  useEffect(() => {
    const usedBefore = storage.getItem('zerodev_wallet_signer') !== null;
    setSignedInBefore(usedBefore);
    setInitializing(false);
  }, []);

  return {
    initializing,
    signedInBefore,
    register: () => connect({ connector: connectors[0] }),
    login: () => {
      connect(
        { connector: connectors[1] },
        { onError: (e) => console.log('login error', e.message) },
      );
    },
    isPending,
  };
}
