'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  KernelAccountClient,
  KernelSmartAccount,
  SponsorUserOperationParameters,
} from '@zerodev/sdk';
import {
  toPasskeyValidator,
  toWebAuthnKey,
  WebAuthnMode,
  PasskeyValidatorContractVersion,
  deserializePasskeyValidator,
} from '@zerodev/passkey-validator';
import { KERNEL_V3_1 } from '@zerodev/sdk/constants';
import { ENTRYPOINT_ADDRESS_V07 } from 'permissionless';
import { http, createPublicClient, Hex, Transport, Chain, Address } from 'viem';
import { getPasskeyData, setPasskeyData } from '@/utils/passkey';
import { getChainsForEnvironment } from '@/store/supportedChains';
import storage from 'local-storage-fallback';

const chain = getChainsForEnvironment();
const publicClient = createPublicClient({
  chain: chain,
  transport: http(),
});

const entryPoint = ENTRYPOINT_ADDRESS_V07;
const kernelVersion = KERNEL_V3_1;

const zerodevApiKey = process.env.NEXT_PUBLIC_ZERODEV_API_KEY;
const passkeyServer = `https://passkeys.zerodev.app/api/v4`;
const paymasterUrl = `https://rpc.zerodev.app/api/v2/paymaster/${zerodevApiKey}`;
const bundlerRpc = `https://rpc.zerodev.app/api/v2/bundler/${zerodevApiKey}`;

type PasskeyContextType = {
  address: Hex | undefined;
  isConnecting: boolean;
  isInitializing: boolean;
  account: KernelSmartAccount<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | null;
  accountClient: KernelAccountClient<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | undefined;
  login: () => Promise<void>;
  register: () => Promise<void>;
  logout: () => void;
};

const PasskeyContext = createContext<PasskeyContextType | undefined>(undefined);

export function PasskeyProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<Hex | undefined>(undefined);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [account, setAccount] = useState<KernelSmartAccount<
    typeof ENTRYPOINT_ADDRESS_V07,
    Transport,
    Chain
  > | null>(null);
  const [accountClient, setAccountClient] = useState<
    KernelAccountClient<typeof ENTRYPOINT_ADDRESS_V07, Transport, Chain> | undefined
  >(undefined);

  const createAccountAndClient = useCallback(async (validator: any) => {
    const newAccount = await createKernelAccount(publicClient, {
      plugins: {
        sudo: validator,
      },
      entryPoint,
      kernelVersion,
      index: 0n,
    });

    const newAccountClient = createKernelAccountClient({
      account: newAccount,
      entryPoint,
      chain,
      bundlerTransport: http(bundlerRpc),
      middleware: {
        sponsorUserOperation: async ({ userOperation }) => {
          const paymasterClient = createZeroDevPaymasterClient({
            chain,
            transport: http(paymasterUrl),
            entryPoint,
          });
          const castedUserOperation = userOperation as SponsorUserOperationParameters<
            typeof entryPoint
          >['userOperation'];
          return paymasterClient.sponsorUserOperation({
            userOperation: castedUserOperation,
            entryPoint,
          });
        },
      },
    });

    setAccount(newAccount);
    setAccountClient(newAccountClient);
    setAddress(newAccount.address.toLowerCase() as Address);
    storage.setItem('userAddress', newAccount.address);
  }, []);

  const reconnect = useCallback(async () => {
    const passkeyData = getPasskeyData();
    console.log('passkeyData', passkeyData);
    if (!passkeyData?.isConnected) return;

    try {
      console.log('reconnecting with saved passkey info');
      const validator = await deserializePasskeyValidator(publicClient, {
        serializedData: passkeyData.signer,
        entryPoint,
        kernelVersion,
      });

      await createAccountAndClient(validator);
    } catch (error) {
      console.error('Reconnection failed:', error);
      setAddress(undefined);
      storage.removeItem('userAddress');
    }
  }, [createAccountAndClient]);

  const loginOrRegister = useCallback(
    async (mode: WebAuthnMode) => {
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

      const passkeyData = passkeyValidator.getSerializedData();
      setPasskeyData(passkeyData, true);

      await createAccountAndClient(passkeyValidator);
    },
    [createAccountAndClient],
  );

  useEffect(() => {
    console.log('triggered');
    const initializeAccount = async () => {
      setIsInitializing(true);
      console.log('reconnecting');
      await reconnect();
      setIsInitializing(false);
    };

    void initializeAccount();
  }, [reconnect]);

  const login = useCallback(async () => {
    setIsConnecting(true);
    try {
      await loginOrRegister(WebAuthnMode.Login);
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [loginOrRegister]);

  const register = useCallback(async () => {
    setIsConnecting(true);
    try {
      await loginOrRegister(WebAuthnMode.Register);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsConnecting(false);
    }
  }, [loginOrRegister]);

  const logout = useCallback(() => {
    setAddress(undefined);
    setAccount(null);
    setAccountClient(undefined);
    storage.removeItem('userAddress');
    setPasskeyData('', false);
  }, []);

  const contextValue = useMemo(
    () => ({
      address,
      isConnecting,
      isInitializing,
      account,
      accountClient,
      login,
      register,
      logout,
    }),
    [address, isConnecting, isInitializing, account, accountClient, login, register, logout],
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
