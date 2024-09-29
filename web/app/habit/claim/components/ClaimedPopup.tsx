import { useMemo } from 'react';
import { formatUnits } from 'viem';
import Image from 'next/image';

import PopupWindow from '@/components/PopupWindow/PopupWindow';
import useSocialShare from '@/hooks/useSocialShare';

const USDC = require('@/imgs/coins/usdc.png');

type ClaimedPopupProps = {
  onClose: () => void;
  onCheckInPageClick: () => void;
  succeedClaimable: bigint;
  stake: bigint;
};

function ClaimedPopup({ onClose, onCheckInPageClick, stake, succeedClaimable }: ClaimedPopupProps) {
  const { shareOnFarcaster } = useSocialShare();
  const title = 'Congratulations!';

  const stakeAmount = parseFloat(formatUnits(stake, 6));
  const claimableAmount = parseFloat(formatUnits(succeedClaimable, 6));
  const bonusAmount = claimableAmount - stakeAmount;

  const content = (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 flex items-center">
        <Image src={USDC} alt="USDC" width={24} height={24} className="mr-2" />
        <span className="font-nunito text-2xl font-bold">{claimableAmount.toFixed(2)}</span>
      </div>
      <p className="m-4 font-nunito text-base">
        You&apos;ve successfully claimed your stake!{' '}
        {bonusAmount > 0 && `Including a bonus of ${bonusAmount.toFixed(2)} USDC`}
      </p>

      <p className="pt-4 font-londrina text-sm text-gray-600">
        Keep up the great work and join more challenges!
      </p>
    </div>
  );

  const handleShareOnFarcaster = () => {
    const message = `I just completed a challenge on Atomic and claimed ${claimableAmount.toFixed(
      2,
    )} USDC${
      bonusAmount > 0 ? `, including a ${bonusAmount.toFixed(2)} USDC bonus` : ''
    }! Join me and start building lasting habits!`;
    shareOnFarcaster(message);
  };

  const buttons = useMemo(() => {
    return [
      {
        id: 'shareOnFarcaster',
        label: 'Share on Farcaster',
        onClick: handleShareOnFarcaster,
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

export default ClaimedPopup;
