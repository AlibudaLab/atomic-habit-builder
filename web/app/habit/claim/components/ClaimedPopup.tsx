import { useMemo } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from '@/components/PopupWindow/PopupWindow';

type ClaimedPopupProps = {
  onClose: () => void;
  onCheckInPageClick: () => void;
};

function ClaimedPopup({ onClose, onCheckInPageClick }: ClaimedPopupProps) {
  const title = 'Reward Received!';

  const content = (
    <div className="flex flex-col items-center text-left">
      <ul className="mb-4 list-disc pl-5">
        <li>Stake Returned</li>
        <li>Stake Reward Received</li>
      </ul>
    </div>
  );

  const handleShareOnFarcaster = () => {};

  const buttons = useMemo(() => {
    return [
      {
        id: 'shareOnFarcaster',
        label: 'Share on Farcaster',
        onClick: handleShareOnFarcaster,
        disabled: true,
        isPrimary: true,
      },
      {
        id: 'backToChallengeList',
        label: 'Back to Challenge List',
        onClick: onCheckInPageClick,
      },
    ];
  }, [handleShareOnFarcaster, onCheckInPageClick]);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

ClaimedPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default ClaimedPopup;
