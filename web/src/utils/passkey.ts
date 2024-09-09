import storage from 'local-storage-fallback';

export type ZeroDevWalletSigner = {
  isConnected: boolean;
  signer: string;
};

export const getPasskeyData = (): ZeroDevWalletSigner | null => {
  const storedData = storage.getItem('zerodev_wallet_signer');
  return storedData ? JSON.parse(storedData) : null;
};

export const setPasskeyData = (signer: string, isConnected: boolean) => {
  storage.setItem('zerodev_wallet_signer', JSON.stringify({ signer, isConnected }));
  return;
};
