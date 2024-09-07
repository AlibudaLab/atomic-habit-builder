'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createKernelAccount, KernelSmartAccount } from '@zerodev/sdk';
import { toPasskeyValidator, toWebAuthnKey, WebAuthnMode, PasskeyValidatorContractVersion, deserializePasskeyValidator } from "@zerodev/passkey-validator"
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { http, createPublicClient, Hex, Transport, Chain } from 'viem';
import { base, polygonMumbai } from 'viem/chains';
import { getZerodevSigner } from '@/utils/passkey';
import { getChainsForEnvironment } from '@/store/supportedChains';

const chain = getChainsForEnvironment()

const publicClient = createPublicClient({
  chain: chain,
  transport: http()
});


const entryPoint = ENTRYPOINT_ADDRESS_V07
const kernelVersion = KERNEL_V3_1

const passkeyServer = `https://passkeys.zerodev.app/api/v4`;

type PasskeyContextType = {
  address: Hex | undefined;
  isLoading: boolean;
  account: KernelSmartAccount<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | null;
  login: () => Promise<void>;
  register: () => Promise<void>;
}

const PasskeyContext = createContext<PasskeyContextType | undefined>(undefined);

export function PasskeyProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Hex | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<KernelSmartAccount<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | null>(null);

  useEffect(() => {
    const initializeAccount = async () => {
      const storedAddress = localStorage.getItem('userAddress');
      if (storedAddress) {
        setAddress(storedAddress as Hex);
        await reconnect();
      }
      setIsLoading(false);
    };

    initializeAccount();
  }, []);

  const reconnect = async () => {
    const passkeyData = getZerodevSigner();
    if (!passkeyData) return;

    try {
      const validator = await deserializePasskeyValidator(publicClient, {
        serializedData: passkeyData.signer,
        entryPoint,
        kernelVersion
      });

      const account = await createKernelAccount(publicClient, {
        plugins: {
          sudo: validator,
        },
        entryPoint,
        kernelVersion
      });

      setAccount(account);
      setAddress(account.address);
    } catch (error) {
      console.error('Reconnection failed:', error);
      setAddress(undefined);
      localStorage.removeItem('userAddress');
    }
  };

  const _login = async () => {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: "atomic",
      passkeyServerUrl: passkeyServer,
      mode: WebAuthnMode.Authentication
    });
     
    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2
    });

    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
      kernelVersion
    });

    setAccount(account);
    setAddress(account.address);
    localStorage.setItem('userAddress', account.address);
  };

  const _register = async () => {
    const webAuthnKey = await toWebAuthnKey({
      passkeyName: "atomic",
      passkeyServerUrl: passkeyServer,
      mode: WebAuthnMode.Register
    })
     
    const passkeyValidator = await toPasskeyValidator(publicClient, {
      webAuthnKey,
      entryPoint: ENTRYPOINT_ADDRESS_V07,
      kernelVersion: KERNEL_V3_1,
      validatorContractVersion: PasskeyValidatorContractVersion.V0_0_2
    })

    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: passkeyValidator,
      },
      entryPoint,
      kernelVersion
    })

    setAccount(account);
    setAddress(account.address);
    localStorage.setItem('userAddress', account.address);
  };

  const login = async () => {
    setIsLoading(true);
    try {
      await _login();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async () => {
    setIsLoading(true);
    try {
      await _register();
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: PasskeyContextType = {
    address,
    isLoading,
    account,
    login,
    register,
  };

  return (
    <PasskeyContext.Provider value={contextValue}>
      {children}
    </PasskeyContext.Provider>
  );
}

export function usePasskeyAccount() {
  const context = useContext(PasskeyContext);
  if (context === undefined) {
    throw new Error('usePasskey must be used within a PasskeyProvider');
  }
  return context;
}