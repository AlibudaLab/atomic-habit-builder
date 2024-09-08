import { useEffect, useMemo, useState, useRef } from 'react';
import processViemContractError from '@/utils/processViemContractError';
import {
  Abi,
  DecodeEventLogReturnType,
  TransactionReceipt,
  decodeEventLog,
  encodeFunctionData,
  http,
} from 'viem';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { useWaitForTransactionReceipt } from 'wagmi';
import { getChainsForEnvironment } from '@/store/supportedChains';

const getEvents = (
  contractCallConfig: any,
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
  const [error, setError] = useState<string | undefined>(undefined);
  const [transactionHash, setTransactionHash] = useState<`0x${string}` | undefined>(undefined);
  const onSuccessCalledRef = useRef(false);

  const { accountClient, account } = usePasskeyAccount();

  console.log('tx error', error);

  const { data: transactionReceipt, isLoading: isWaitForTransactionLoading } =
    useWaitForTransactionReceipt({
      hash: transactionHash,
    });

  const submitTransaction = () => {
    if (!accountClient || !account) {
      console.log('accountClient', accountClient);
      console.log('account', account);
      setError('No account connected');
      return;
    }

    setIsLoading(true);
    setError(undefined);

    const transactions = Array.isArray(contractCallConfig.contracts)
      ? contractCallConfig.contracts
      : [contractCallConfig];

    accountClient.sendTransactions({
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
  };

  useEffect(() => {
    if (transactionReceipt && options?.onSuccess && !onSuccessCalledRef.current) {
      const events = getEvents(contractCallConfig, transactionReceipt);
      options.onSuccess(transactionReceipt, events as DecodeEventLogReturnType[]);
      onSuccessCalledRef.current = true; // Mark onSuccess as called for this transaction
    }
  }, [transactionReceipt, options, contractCallConfig]);

  useEffect(() => {
    return () => {
      setTransactionHash(undefined);
      setError(undefined);
      onSuccessCalledRef.current = false; // Reset the ref when the component unmounts
    };
  }, []);

  return {
    onSubmitTransaction: submitTransaction,
    isPreparing: false,
    isLoading: loading || isWaitForTransactionLoading,
    error,
    transactionHash,
    transactionReceipt,
  };
};

export default useSubmitTransaction;
