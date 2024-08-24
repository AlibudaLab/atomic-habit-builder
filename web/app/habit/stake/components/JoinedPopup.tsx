import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Challenge } from '@/types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { randomChoice } from '@/utils/content';

type JoinedPopupProps = {
  challenge: Challenge;
  onClose: () => void;
  onCheckInPageClick: () => void;
};

function JoinedPopup({ challenge, onClose, onCheckInPageClick }: JoinedPopupProps) {
  const title = "You've Successfully\nJoined the Challenge!";

  const started = useMemo(() => {
    return challenge.startTimestamp < moment().unix();
  }, [challenge.startTimestamp]);

  const additionalText = useMemo(() => {
    return randomChoice([
      `You're in. Now don't let your USDC become someone else's bonus.`,
      `Challenge accepted. Your wallet's fate is in your hands now.`,
      `Game on. Your USDC's either motivating you or motivating others soon.`,
      `You've stepped into the arena. Time to turn those USDC into trophies.`,
    ]);
  }, []);

  const content = (
    <div className="mx-4 font-nunito">
      {started ? (
        <p>Challenge ends {moment.unix(challenge.endTimestamp).fromNow()}!</p>
      ) : (
        <p>Challenge starts {moment.unix(challenge.startTimestamp).fromNow()}!</p>
      )}
      <div className="mt-8 text-sm italic">{additionalText}</div>
    </div>
  );

  const buttons = useMemo(() => {
    return [
      {
        id: 'goToCheckIn',
        label: 'Start Checking In',
        onClick: onCheckInPageClick,
        isPrimary: true,
      },
    ];
  }, [onCheckInPageClick]);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

JoinedPopup.propTypes = {
  challenge: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default JoinedPopup;
