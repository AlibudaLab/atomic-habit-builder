import { useMemo, useCallback, useState } from 'react';

import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { getBridgePageLink } from '@/utils/bridge';
import { Address } from 'viem';
import toast from 'react-hot-toast';
import DepositPopup from './DepositPopup';

type AddFundPopupProps = {
  onClose: () => void;
  title?: string;
  address: Address | undefined;
  description?: string;
};

/**
 * Add fund popup: deposit to base address, or open a "bridge" link to deposit from any wallet
 * @param param0
 * @returns
 */
function AddFundPopup({
  address,
  title = 'Insufficient Wallet Balance',
  description = 'Please deposit or onramp to join the challenge',
  onClose,
}: AddFundPopupProps) {
  const [isDepositPopupOpen, setIsDepositPopupOpen] = useState(false);

  const content = <div className="p-4 font-nunito"> {description} </div>;

  const handleDepositFromBridge = useCallback(() => {
    if (!address) return toast.error('Please connect your wallet first');

    const link = getBridgePageLink(address);
    window.open(link, '_blank');
  }, [address]);

  const buttons = useMemo(() => {
    return [
      {
        id: 'deposit',
        label: 'Deposit to address',
        onClick: () => setIsDepositPopupOpen(true),
        isPrimary: true,
      },
      {
        id: 'deposit-from-bdige',
        label: 'Deposit from any wallet',
        onClick: handleDepositFromBridge,
        isPrimary: false,
      },
    ];
  }, [handleDepositFromBridge, setIsDepositPopupOpen]);

  return isDepositPopupOpen ? (
    <DepositPopup onClose={() => setIsDepositPopupOpen(false)} />
  ) : (
    <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />
  );
}

export default AddFundPopup;
