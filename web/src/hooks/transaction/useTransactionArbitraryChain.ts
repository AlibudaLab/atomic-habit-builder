import { useEffect, useState, useRef, useCallback } from 'react';
import processViemContractError from '@/utils/processViemContractError';
import { Chain, TransactionReceipt, createPublicClient, encodeFunctionData, http } from 'viem';
import { usePasskeyAccount, kernelVersion, entryPoint } from '@/providers/PasskeyProvider';
import { useWaitForTransactionReceipt } from 'wagmi';
import {
  createKernelAccount,
  createKernelAccountClient,
  createZeroDevPaymasterClient,
  SponsorUserOperationParameters,
} from '@zerodev/sdk';

import { zeroDevApiKeys } from '@/constants';
import { deserializePasskeyValidator } from '@zerodev/passkey-validator';
import { getPasskeyData } from '@/utils/passkey';
import { connect } from 'http2';

const createCustomAccountClient = (chain: Chain, account: any) => {
  const zerodevApiKey = zeroDevApiKeys[chain.id];
  const paymasterUrl = `https://rpc.zerodev.app/api/v2/paymaster/${zerodevApiKey}`;
  const bundlerRpc = `https://rpc.zerodev.app/api/v2/bundler/${zerodevApiKey}`;

  // TODO: swithc to other paymaster
  const newAccountClient = createKernelAccountClient({
    chain,
    account,
    entryPoint,
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
  return newAccountClient;
};

const useTransactionArbitraryChain = (
  contractCallConfig: any,
  options?: {
    customErrorsMap?: Record<string, string>;
    onSuccess?: (transactionReceipt: TransactionReceipt) => void;
    onSent?: () => void;
    onError?: (errorMessage: string, rawError: any) => void;
  },
) => {
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const onSuccessCalledRef = useRef(false);

  const { account: connectedAccount } = usePasskeyAccount();

  const { data: transactionReceipt, isLoading: isWaitForTransactionLoading } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  const submitTransaction = useCallback(async () => {
    if (!connectedAccount) {
      setError('No account connected');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const transactions = Array.isArray(contractCallConfig.contracts)
      ? contractCallConfig.contracts
      : [contractCallConfig];

    // recreate account, with new publicClient
    const chain = contractCallConfig.chain;

    const publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });
    const passkeyData = getPasskeyData();
    if (!passkeyData) {
      throw new Error('No passkey data found');
    }
    const validator = await deserializePasskeyValidator(publicClient, {
      serializedData: passkeyData.signer,
      entryPoint,
      kernelVersion,
    });
    const account = await createKernelAccount(publicClient, {
      plugins: {
        sudo: validator,
      },
      entryPoint,
      kernelVersion,
      index: 0n,
    });

    if (account.address !== connectedAccount.address) {
      throw new Error('Account mismatch!');
    }

    const customAccountClient = createCustomAccountClient(chain, account);

    // initiate a new account client (not necessarily base)
    // const accountClient = create({
    customAccountClient
      .sendTransactions({
        transactions: transactions.map((contract: any) => ({
          to: contract.address,
          data: encodeFunctionData({
            abi: contract.abi,
            functionName: contract.functionName,
            args: contract.args,
          }),
          value: BigInt(contract.value ?? 0),
        })),
        account: account,
      })
      .then((txHash) => {
        setTransactionHash(txHash);
        onSuccessCalledRef.current = false;
        options?.onSent?.();
      })
      .catch((err: any) => {
        const errorMessage = processViemContractError(err, (errorName) => {
          if (!options?.customErrorsMap || !(errorName in options.customErrorsMap))
            return `Contract error: ${errorName}`;
          return options.customErrorsMap[errorName];
        });
        setError(errorMessage ?? 'Unknown error occurred');
        options?.onError?.(errorMessage ?? 'Unknown error occurred', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [connectedAccount, contractCallConfig, options]);

  useEffect(() => {
    if (transactionReceipt && options?.onSuccess && !onSuccessCalledRef.current) {
      options.onSuccess(transactionReceipt);
      onSuccessCalledRef.current = true; // Mark onSuccess as called for this transaction
    }
  }, [transactionReceipt, options, contractCallConfig]);

  return {
    onSubmitTransaction: submitTransaction,
    isPreparing: false,
    isLoading: loading || isWaitForTransactionLoading,
    error,
    transactionHash,
    transactionReceipt,
  };
};

export default useTransactionArbitraryChain;
