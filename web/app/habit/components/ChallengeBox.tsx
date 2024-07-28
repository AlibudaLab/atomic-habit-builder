import { Challenge } from '@/types';
import { challengeToEmoji } from '@/utils/challenges';
import { formatDuration } from '@/utils/timestamp';
import moment from 'moment';

export function ChallengeBox({ challenge }: { challenge: Challenge }) {
  const isPast = challenge.endTimestamp < moment().unix();

  return (
    <button
      type="button"
      className={`wrapped m-2 w-full transition-transform duration-300 focus:scale-105 ${
        isPast && 'opacity-50'
      }`}
    >
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2 text-primary">
          <p className="text-xs font-bold opacity-80">
            {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
          </p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> {challenge.participants} joined </p>
        </div>
        <div className="ml-auto p-2 text-sm font-bold">{challenge.targetNum} times</div>
      </div>
    </button>
  );
}

export function ChallengeBoxFilled({
  challenge,
  checkedIn,
  fullWidth
}: {
  challenge: Challenge;
  checkedIn?: number;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();

  return (
    <div className={`wrapped-filled m-2 p-2 ${isPast && 'opacity-50'} ${fullWidth && 'w-full'}`}>
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <p className="text-xs opacity-80">
            {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
          </p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> {challenge.participants} joined </p>
        </div>
        {
          // if checkedIn is defined, show the checkedIn number, otherwise show the target number
          checkedIn !== undefined ? (
            <div className="ml-auto p-2 text-lg min-w-[64px] ">
              {checkedIn} / {challenge.targetNum}
            </div>
          ) : (
            <div className="text-md ml-auto p-2">{challenge.targetNum} times</div>
          )
        }
      </div>
    </div>
  );
}
