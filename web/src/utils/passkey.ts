import storage from 'local-storage-fallback';

export type ZeroDevWalletSigner = {
  isConnected: boolean;
  signer: string;
};

export const getZerodevSigner = (): ZeroDevWalletSigner | null => {
  const signer = storage.getItem('zerodev_wallet_signer');
  if (!signer) return null;

  try {
    const parsedSigner = JSON.parse(signer);
    if (
      parsedSigner &&
      typeof parsedSigner === 'object' &&
      'isConnected' in parsedSigner &&
      'signer' in parsedSigner
    ) {
      return parsedSigner as ZeroDevWalletSigner;
    }
    return null;
  } catch (err) {
    return null;
  }
};

export const setZerodevSigner = (signer: string, isConnected: boolean) => {
  storage.setItem('zerodev_wallet_signer', JSON.stringify({ signer, isConnected }));
  return;
};
