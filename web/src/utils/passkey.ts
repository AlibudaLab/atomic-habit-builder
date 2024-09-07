import storage from 'local-storage-fallback';

export type ZeroDevWalletSigner = {
  isConnected: boolean;
  signer: string;
};

export const getZerodevSigner = (): ZeroDevWalletSigner | null => {
  const storedData = storage.getItem('zerodevSigner');
  return storedData ? JSON.parse(storedData) : null;
};

export const setZerodevSigner = (signer: string, isConnected: boolean) => {
  storage.setItem('zerodev_wallet_signer', JSON.stringify({ signer, isConnected }));
  return;
};

export function updateZerodevSigner(passkeyData: any) {
  storage.setItem('zerodevSigner', JSON.stringify(passkeyData));
}
