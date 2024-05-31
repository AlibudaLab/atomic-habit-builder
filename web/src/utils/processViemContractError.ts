import { BaseError, ContractFunctionRevertedError, InsufficientFundsError } from 'viem';

/**
 * @description This file was learned in https://github.com/guildxyz/guild.xyz/blob/3b150b2b9b9c3bf816cf0bc915753df432274399/src/utils/processViemContractError.ts
 * getPrettyViemError was removed
 */

const processViemContractError = (
  error: Error,
  errorNameMapper?: (errorName: string) => string,
): string | undefined => {
  if (!error) return undefined;
  let mappedError: string | undefined = undefined;

  if (error instanceof BaseError) {
    const revertError = error.walk((err) => err instanceof ContractFunctionRevertedError);

    if (
      typeof errorNameMapper === 'function' &&
      revertError instanceof ContractFunctionRevertedError
    ) {
      const errorName = revertError.data?.errorName ?? '';
      mappedError = errorNameMapper(errorName);
    }

    const insufficientFundsError = error.walk((err) => err instanceof InsufficientFundsError);
    if (insufficientFundsError) {
      return 'Your current balance is insufficient to cover the guild fee and the transaction gas costs';
    }

    return mappedError ?? error.shortMessage ?? error.message ?? 'Contract error';
  }

  return undefined;
};

export default processViemContractError;
