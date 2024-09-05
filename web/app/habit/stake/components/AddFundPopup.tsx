import { useMemo, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { GateFiSDK } from '@gatefi/js-sdk';

import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { getBridgePageLink } from '@/utils/bridge';
import { Address } from 'viem';

type AddFundPopupProps = {
  onClose: () => void;
  onDepositClick: () => void;
  title?: string;
  address: Address
};

/**
 * Add fund popup: deposit to base address, or open a "bridge" link to deposit from any wallet
 * @param param0 
 * @returns 
 */
function AddFundPopup({ 
  address,
  title = 'Insufficient Wallet Balance', 
  onClose, 
  onDepositClick 
}: AddFundPopupProps) {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);

  useEffect(() => {
    return () => {
      overlayInstanceSDK.current?.destroy();
      overlayInstanceSDK.current = null;
    };
  }, []);

  const content = <div className="p-4">Please deposit or onramp to join the challenge.</div>;

  const handleDepositFromBridge = useCallback(() => {
    const link = getBridgePageLink(address);
    window.open(link, '_blank');
  }, [address]);

  const buttons = useMemo(() => {
    return [
      {
        id: 'deposit',
        label: 'Deposit to address',
        onClick: onDepositClick,
        isPrimary: true,
      },
      {
        id: 'deposit-from-bdige',
        label: 'Deposit from any wallet',
        onClick: handleDepositFromBridge,
        disabled: true,
        isPrimary: true,
      },
    ];
  }, [handleDepositFromBridge, onDepositClick]);

  return (
    <div>
      <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />
      <div id="overlay-button">{}</div>
    </div>
  );
}

AddFundPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onDepositClick: PropTypes.func.isRequired,
};

export default AddFundPopup;
