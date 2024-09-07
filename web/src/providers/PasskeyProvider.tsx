'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { createKernelAccount, KernelSmartAccount } from '@zerodev/sdk';
import {
  toPasskeyValidator,
  toWebAuthnKey,
  WebAuthnMode,
  PasskeyValidatorContractVersion,
  deserializePasskeyValidator,
} from '@zerodev/passkey-validator';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { http, createPublicClient, Hex, Transport, Chain } from 'viem';
import { getZerodevSigner, updateZerodevSigner } from '@/utils/passkey';
import { getChainsForEnvironment } from '@/store/supportedChains';
import storage from 'local-storage-fallback';

const chain = getChainsForEnvironment();

const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

const entryPoint = ENTRYPOINT_ADDRESS_V07;
const kernelVersion = KERNEL_V3_1;

const passkeyServer = `https://passkeys.zerodev.app/api/v4`;

type PasskeyContextType = {
  address: Hex | undefined;
  isLoading: boolean;
  isInitializing: boolean;
  account: KernelSmartAccount<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | null;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
};

const PasskeyContext = createContext<PasskeyContextType | undefined>(undefined);

export function PasskeyProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Hex | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [account, setAccount] = useState<KernelSmartAccount<
    typeof ENTRYPOINT_ADDRESS_V07,
    Transport,
    Chain
  > | null>(null);

  const reconnect = useCallback(async () => {
    const passkeyData = getZerodevSigner();
    if (!passkeyData?.isConnected) return;

    try {
      const validator = await deserializePasskeyValidator(publicClient, {
        serializedData: passkeyData.signer,
        entryPoint,
        kernelVersion,
      });

      const newAccount = await createKernelAccount(publicClient, {
        plugins: {
          sudo: validator,
        },
        entryPoint,
        kernelVersion,
      });

      setAccount(newAccount);
      setAddress(newAccount.address);
    } catch (error) {
      console.error('Reconnection failed:', error);
      setAddress(undefined);
      storage.removeItem('userAddress');
    }
  }, []);

  const loginOrRegister = useCallback(async (mode: WebAuthnMode) => {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: 'atomic',
      passkeyServerUrl: passkeyServer,
      mode,
      passkeyServerHeaders: {},
    });

    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2,
    });

    const newAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
      kernelVersion,
    });

    setAccount(newAccount);
    setAddress(newAccount.address);
    storage.setItem('userAddress', newAccount.address);
  }, []);

  useEffect(() => {
    const initializeAccount = async () => {
      setIsInitializing(true);
      const storedAddress = storage.getItem('userAddress');
      if (storedAddress) {
        setAddress(storedAddress as Hex);
        await reconnect();
      }
      setIsInitializing(false);
    };

    void initializeAccount();
  }, [reconnect]);

  const login = useCallback(async () => {
    setIsLoading(true);
    try {
      await loginOrRegister(WebAuthnMode.Login);
      const passkeyData = getZerodevSigner();
      if (passkeyData) {
        passkeyData.isConnected = true;
        updateZerodevSigner(passkeyData);
      }
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loginOrRegister]);

  const register = useCallback(async () => {
    setIsLoading(true);
    try {
      await loginOrRegister(WebAuthnMode.Register);
      const passkeyData = getZerodevSigner();
      if (passkeyData) {
        passkeyData.isConnected = true;
        updateZerodevSigner(passkeyData);
      }
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  }, [loginOrRegister]);

  const logout = useCallback(() => {
    setAddress(undefined);
    setAccount(null);
    storage.removeItem('userAddress');
    const passkeyData = getZerodevSigner();
    if (passkeyData) {
      passkeyData.isConnected = false;
      updateZerodevSigner(passkeyData);
    }
  }, []);

  const contextValue = useMemo(
    () => ({
      address,
      isLoading,
      isInitializing,
      account,
      login,
      register,
      logout,
    }),
    [address, isLoading, isInitializing, account, login, register, logout],
  );

  return <PasskeyContext.Provider value={contextValue}>{children}</PasskeyContext.Provider>;
}

export function usePasskeyAccount() {
  const context = useContext(PasskeyContext);
  if (context === undefined) {
    throw new Error('usePasskey must be used within a PasskeyProvider');
  }
  return context;
}
