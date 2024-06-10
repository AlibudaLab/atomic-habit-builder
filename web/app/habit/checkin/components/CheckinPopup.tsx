import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useAccount } from 'wagmi';

import { Challenge } from '@/types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import useUserChallengeCheckIns from '@/hooks/useUserCheckIns';

type CheckinPopupProps = {
  challenge: Challenge;
  onClose: () => void;
  onCheckInPageClick: () => void;
};

function CheckinPopup({ challenge, onClose, onCheckInPageClick }: CheckinPopupProps) {
  const { address } = useAccount();

  const { checkedIn } = useUserChallengeCheckIns(address, BigInt(challenge.id));

  const remainingDays = Math.max(
    0,
    Math.ceil((challenge.endTimestamp - moment().unix()) / (60 * 60 * 24)),
  );

  const title = "You've Successfully\nChecked in!";

  const content = (
    <div className="flex flex-col items-center text-left">
      <ul className="mb-4 list-disc pl-5">
        <li>
          Total Check in: {checkedIn} / {challenge.targetNum}
        </li>
        <li>Remaining days: {remainingDays}</li>
      </ul>
    </div>
  );

  const buttons = useMemo(() => {
    return [
      {
        id: 'backToChallengeList',
        label: 'Back to Challenge List',
        onClick: onCheckInPageClick,
      },
      {
        id: 'checkInOtherRecords',
        label: 'Check in other Records',
        onClick: onClose,
      },
    ];
  }, []);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

CheckinPopup.propTypes = {
  challenge: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default CheckinPopup;
