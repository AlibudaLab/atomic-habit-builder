'use client';

import { logEventSimple } from '@/utils/gtag';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import storage from 'local-storage-fallback';
import { useEffect, useState, useCallback } from 'react';

export default function usePasskeyConnection() {
  const [signedInBefore, setSignedInBefore] = useState(false);
  const { login, register, isConnecting, isInitializing } = usePasskeyAccount();

  useEffect(() => {
    const usedBefore = storage.getItem('zerodev_wallet_signer') !== null;
    setSignedInBefore(usedBefore);
  }, []);

  const handleRegister = useCallback(() => {
    void register()
      .then(() => {
        logEventSimple({ eventName: 'clieck_sign_up', category: 'connect' });
      })
      .catch((error) => {
        console.error('Registration failed:', error);
      });
  }, [register]);

  const handleLogin = useCallback(() => {
    void login()
      .then(() => {
        logEventSimple({ eventName: 'click_sign_in', category: 'connect' });
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  }, [login]);

  return {
    initializing: isInitializing,
    signedInBefore,
    register: handleRegister,
    login: handleLogin,
    isPending: isConnecting,
  };
}
