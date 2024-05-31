import { useEffect } from 'react';
import processViemContractError from '@/utils/processViemContractError';
import { Abi, DecodeEventLogReturnType, TransactionReceipt, decodeEventLog } from 'viem';
import {
  UseSimulateContractParameters,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { useWriteContracts, useCallsStatus } from 'wagmi/experimental';

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
 * @param options.onSuccess
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
    batchTx?: boolean;
    onSuccess?: (
      transactionReceipt: TransactionReceipt,
      events: DecodeEventLogReturnType[],
    ) => void;
    onError?: (errorMessage: string, rawError: any) => void;
  },
) => {
  const { error: simulateContractError, isLoading: isSimulateContractLoading } =
    useSimulateContract({
      query: { enabled: contractCallConfig.query?.enabled ?? true },
      ...contractCallConfig,
    });

  const {
    writeContract,
    data: writeHash,
    error: writeContractError,
    isError: isWriteContractError,
    isPending: isWriteContractLoading,
    reset: resetWriteContract,
  } = useWriteContract();

  const {
    writeContracts,
    data: batchHash,
    error: batchWriteContractError,
    isError: isBatchWriteContractError,
    isPending: isBatchWriteContractLoading,
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

  const writeContractToUse = options?.batchTx ? writeContracts : writeContract;
  const hashToUse = options?.batchTx
    ? (callsStatus?.receipts?.[0]?.transactionHash as `0x${string}`)
    : writeHash;
  const contractWriteErrorToUse = options?.batchTx ? batchWriteContractError : writeContractError;
  const isContractWriteErrorToUse = options?.batchTx
    ? isBatchWriteContractError
    : isWriteContractError;
  const isContractWriteLoadingToUse = options?.batchTx
    ? isBatchWriteContractLoading
    : isWriteContractLoading;
  const resetToUse = options?.batchTx ? resetBatchWriteContract : resetWriteContract;

  const {
    data: transactionReceipt,
    error: waitForTransactionError,
    isSuccess,
    isError: isWaitForTransactionError,
    isLoading: isWaitForTransactionLoading,
  } = useWaitForTransactionReceipt({
    hash: hashToUse as `0x${string}`,
  });

  const rawError = waitForTransactionError ?? contractWriteErrorToUse ?? simulateContractError;

  const error = rawError
    ? processViemContractError(rawError, (errorName) => {
        if (!options?.customErrorsMap || !(errorName in options.customErrorsMap))
          return `Contract error: ${errorName}`;
        return options.customErrorsMap[errorName];
      })
    : undefined;

  const isError = isContractWriteErrorToUse || isWaitForTransactionError;
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
      }
    }

    if (error) {
      onError?.(error, rawError);
      resetToUse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionReceipt, isSuccess, isError]);

  return {
    onSubmitTransaction: () => {
      if (!writeContractToUse && error) {
        onError?.(error, rawError);
        return;
      }

      if (options?.batchTx) {
        writeContracts?.(contractCallConfig);
      } else {
        writeContract?.(contractCallConfig);
      }
    },
    isPreparing: isSimulateContractLoading,
    isLoading: isWaitForTransactionLoading || isContractWriteLoadingToUse,
    error,
  };
};

export default useSubmitTransaction;
