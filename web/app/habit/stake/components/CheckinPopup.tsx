import { useMemo } from 'react';
import PropTypes from 'prop-types';

import PopupWindow from '@/components/PopupWindow/PopupWindow';

type CheckInPopupProps = {
  onClose: () => void;
  onCheckInPageClick: () => void;
};

function CheckInPopup({ onClose, onCheckInPageClick }: CheckInPopupProps) {
  const title = "You've Successfully\nJoined the Challenge!";

  //TODO @ryanycw: Change the date to the actual start date
  const content = (
    <div>
      <p>Challenge starts from</p>
      <p>
        <strong>May 1st</strong>
      </p>
    </div>
  );

  const buttons = useMemo(() => {
    return [
      {
        id: 'goToCheckIn',
        label: 'Go to Check in Page',
        onClick: onCheckInPageClick,
        className: 'popup-buttons',
      },
    ];
  }, []);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

CheckInPopup.propTypes = {
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default CheckInPopup;
