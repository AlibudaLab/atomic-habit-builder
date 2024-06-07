import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Challenge } from '@/types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';

type JoinedPopupProps = {
  challenge: Challenge;
  onClose: () => void;
  onCheckInPageClick: () => void;
};

function JoinedPopup({ challenge, onClose, onCheckInPageClick }: JoinedPopupProps) {
  const title = "You've Successfully\nJoined the Challenge!";

  const content = (
    <div>
      <p>Challenge starts from</p>
      <p>
        <strong>{moment.unix(Number(challenge.startTimestamp.toString())).format('MMMM Do')}</strong>
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

JoinedPopup.propTypes = {
  challenge: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default JoinedPopup;
