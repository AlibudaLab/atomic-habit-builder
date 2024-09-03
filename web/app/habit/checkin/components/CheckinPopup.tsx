import { useMemo } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import { Challenge } from '@/types';
import PopupWindow from '@/components/PopupWindow/PopupWindow';
import { Button } from '@nextui-org/button';
import { BsTwitterX } from 'react-icons/bs';

import farcasterLogo from '@/imgs/socials/farcaster.png';
import Image from 'next/image';
import useSocialShare from '@/hooks/useSocialShare';

type CheckinPopupProps = {
  challenge: Challenge;
  onClose: () => void;
  onCheckInPageClick: () => void;
  checkedIn: number;
};

function CheckinPopup({ challenge, onClose, onCheckInPageClick, checkedIn }: CheckinPopupProps) {
  const isFinished = useMemo(
    () => checkedIn >= challenge.minimumCheckIns,
    [checkedIn, challenge.minimumCheckIns],
  );

  const title = useMemo(() => {
    if (isFinished) return 'Challenge Completed!';
    return "You've Successfully\nChecked in!";
  }, [isFinished]);

  const shareContent = useMemo(() => {
    if (isFinished) return `I've completed the challenge ${challenge.name}!`;
    return `I just checked in for the challenge ${challenge.name}!`;
  }, [isFinished, challenge.name]);

  const shareURL = window.origin + `/habit/stake/${challenge.id}`;

  const { shareOnX, shareOnFarcaster } = useSocialShare();

  const content = (
    <div className="flex flex-col items-center text-left">
      <ul className="mb-4 list-disc pl-5">
        {!isFinished && (
          <li>
            Total Check in: {checkedIn} / {challenge.minimumCheckIns}
          </li>
        )}
        <li>
          {' '}
          Challenge {isFinished ? 'settles' : 'ends'}{' '}
          {moment.unix(challenge.endTimestamp).fromNow()}
        </li>
      </ul>

      {/* share */}
      <div className="mt-4 flex flex-col text-center">
        <p className="text-xs text-default-400"> Share your progress with friends! </p>
        <div className="flex gap-2 p-2">
          <Button
            className="w-full"
            onClick={() => shareOnX(shareContent, shareURL)}
            endContent={<BsTwitterX />}
          >
            Share on
          </Button>
          <Button
            className="w-full"
            onClick={() => shareOnFarcaster(shareContent, [shareURL])}
            endContent={<Image src={farcasterLogo} alt="warp" height={25} width={25} />}
          >
            Share on
          </Button>
        </div>
      </div>
    </div>
  );

  const buttons = useMemo(() => {
    const defaultButtons = [
      {
        id: 'backToChallengeList',
        label: 'Back to Challenge List',
        onClick: onCheckInPageClick,
        isPrimary: true,
      },
    ];
    if (!isFinished) {
      defaultButtons.push({
        id: 'checkInOtherRecords',
        label: 'Check in other Records',
        onClick: onClose,
        isPrimary: true,
      });
    }
    return defaultButtons;
  }, [onCheckInPageClick, onClose, isFinished]);

  return <PopupWindow title={title} onClose={onClose} content={content} buttons={buttons} />;
}

CheckinPopup.propTypes = {
  challenge: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onCheckInPageClick: PropTypes.func.isRequired,
};

export default CheckinPopup;
