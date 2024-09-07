'use client';

import { logEventSimple } from '@/utils/gtag';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import storage from 'local-storage-fallback';
import { useEffect, useState } from 'react';

export default function usePasskeyConnection() {
  const [initializing, setInitializing] = useState(true);
  const [signedInBefore, setSignedInBefore] = useState(false);
  const { login, register, isLoading } = usePasskeyAccount();

  useEffect(() => {
    const usedBefore = storage.getItem('zerodev_wallet_signer') !== null;
    setSignedInBefore(usedBefore);
    setInitializing(false);
  }, []);

  return {
    initializing,
    signedInBefore,
    register: () => {
      register().then(() => {
        logEventSimple({ eventName: 'clieck_sign_up', category: 'connect' });
      });
    },
    login: () => {
      login().then(() => {
        logEventSimple({ eventName: 'click_sign_in', category: 'connect' });
      })
    },
    isPending: isLoading,
  };
}
