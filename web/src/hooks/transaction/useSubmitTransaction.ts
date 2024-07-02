import { useEffect, useState } from 'react';
import processViemContractError from '@/utils/processViemContractError';
import { Abi, DecodeEventLogReturnType, TransactionReceipt, decodeEventLog } from 'viem';
import {
  UseSimulateContractParameters,
  useSimulateContract,
  useWaitForTransactionReceipt,
} from 'wagmi';
import { useWriteContracts, useCallsStatus } from 'wagmi/experimental';

const zerodevApiKey = process.env.NEXT_PUBLIC_ZERODEV_API_KEY;
const ZERODEV_PAYMASTER_URL = `https://rpc.zerodev.app/api/v3/paymaster/${zerodevApiKey}`;

const getEvents = (
  contractCallConfig: UseSimulateContractParameters,
  transactionReceipt: TransactionReceipt | Record<string, any>,
) =>
  transactionReceipt.logs
    .map((log: any) => {
      try {
        return decodeEventLog({
          abi: contractCallConfig.abi as Abi,
          data: log.data,
          topics: log.topics,
        });
      } catch {
        return null;
      }
    })
    .filter(Boolean);

/**
 *
 * @param contractCallConfig is the typicall write contract config
 * @param options.setContext
 * @param options.customErrorsMap convert contract custon errors to human readable messages
 *
 * @param options.onSent successfully submit the transaction
 * @param options.onSuccess tx confirmed
 * @param options.onError
 * @returns
 * @description This file was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/hooks/useSubmitTransaction.ts
 * And three parts were adjusted:
 * 1. Estimate gas was removed,
 * 2. Transaction status context was removed
 * 3. contractCallConfig was defined as any
 */

const useSubmitTransaction = (
  contractCallConfig: any,
  options?: {
    customErrorsMap?: Record<string, string>;
    onSuccess?: (
      transactionReceipt: TransactionReceipt,
      events: DecodeEventLogReturnType[],
    ) => void;
    onSent?: () => void;
    onError?: (errorMessage: string, rawError: any) => void;
  },
) => {
  const [loading, setIsLoading] = useState(false);

  const { error: simulateContractError, isLoading: isSimulateContractLoading } =
    useSimulateContract({
      query: { enabled: contractCallConfig.query?.enabled ?? true },
      ...contractCallConfig,
    });

  const {
    writeContracts,
    data: batchHash,
    error: batchWriteContractError,
    isError: isBatchWriteContractError,
    isPending: isBatchWriteContractLoading,
    isSuccess: isBatchWriteContractSuccess,

    reset: resetBatchWriteContract,
  } = useWriteContracts();

  const { data: callsStatus } = useCallsStatus({
    id: batchHash as string,
    query: {
      enabled: !!batchHash,
      // Poll every second until the calls are confirmed
      refetchInterval: (data: any) => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
    },
  });

  const {
    data: transactionReceipt,
    error: waitForTransactionError,
    isSuccess,
    isError: isWaitForTransactionError,
    isLoading: isWaitForTransactionLoading,
  } = useWaitForTransactionReceipt({
    hash: callsStatus?.receipts?.[0]?.transactionHash as `0x${string}`,
  });

  const rawError = waitForTransactionError ?? batchWriteContractError ?? simulateContractError;

  const error = rawError
    ? processViemContractError(rawError, (errorName) => {
        if (!options?.customErrorsMap || !(errorName in options.customErrorsMap))
          return `Contract error: ${errorName}`;
        return options.customErrorsMap[errorName];
      })
    : undefined;

  const isError = isBatchWriteContractError || isWaitForTransactionError;
  const { onSuccess, onError } = options ?? {};

  useEffect(() => {
    if (!transactionReceipt && !isSuccess && !isError) return;

    if (transactionReceipt && isSuccess) {
      if (typeof onSuccess === 'function') {
        const events = getEvents(contractCallConfig, transactionReceipt);

        onSuccess(
          transactionReceipt as TransactionReceipt,
          events as unknown as DecodeEventLogReturnType[],
        );
        setIsLoading(false);
      }
    }

    if (error) {
      onError?.(error, rawError);
      setIsLoading(false);
      resetBatchWriteContract();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionReceipt, isSuccess, isError]);

  return {
    onSubmitTransaction: () => {
      setIsLoading(true);
      writeContracts?.(
        {
          contracts: contractCallConfig.contracts || [contractCallConfig],
          capabilities: {
            paymasterService: {
              url: ZERODEV_PAYMASTER_URL,
            },
          },
        },
        {
          // tx successfully sent to the bundler
          onSuccess: () => {
            if (typeof options?.onSent === 'function') {
              options.onSent();
            }
          },
        },
      );
    },
    isPreparing: isSimulateContractLoading,
    isLoading: isWaitForTransactionLoading || isBatchWriteContractLoading || loading,
    error,
  };
};

export default useSubmitTransaction;
