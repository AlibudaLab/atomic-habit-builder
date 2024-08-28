import { Challenge } from '@/types';
import { challengeToEmoji, getChallengeUnit } from '@/utils/challenges';
import { formatDuration, getCountdownString } from '@/utils/timestamp';
import moment from 'moment';
import { CircularProgress } from '@nextui-org/react';
import { CheckCheckIcon } from 'lucide-react';
import { formatUnits } from 'viem';

export function ChallengeBox({
  challenge,
  fullWidth,
}: {
  challenge: Challenge;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();

  return (
    <button
      type="button"
      className={`wrapped transition-transform duration-300 focus:scale-105 ${
        isPast && 'opacity-50'
      } ${fullWidth ? 'w-full' : 'm-2'}`}
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
  fullWidth,
}: {
  challenge: Challenge;
  checkedIn?: number;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();

  return (
    <div
      className={`wrapped-filled p-2 ${isPast ? 'opacity-50' : ''} ${fullWidth ? 'w-full' : 'm-2'}`}
    >
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
            <div className="ml-auto min-w-[64px] p-2 text-lg ">
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

export function ChallengePreview({
  challenge,
  checkedIn,
  fullWidth,
}: {
  challenge: Challenge;
  checkedIn: number;
  fullWidth?: boolean;
}) {
  const isPast = challenge.endTimestamp < moment().unix();

  let percentage = (checkedIn * 100) / challenge.targetNum;

  const isCompleted = checkedIn >= challenge.targetNum;

  if (percentage == 0) {
    percentage = 50;
    checkedIn = 2;
  }

  return (
    <div
      className={`wrapped-filled p-2 ${isPast ? 'opacity-50' : ''} ${fullWidth ? 'w-full' : 'm-2'}`}
    >
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <p className="text-xs opacity-80">{getCountdownString(challenge.endTimestamp)} left</p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> ${formatUnits(challenge.stake, 6)} staked </p>
        </div>
        <div className="ml-auto min-w-[64px] p-2 text-lg ">
          <CircularProgress
            value={percentage}
            size="lg"
            label={`${checkedIn} ${getChallengeUnit(challenge.type)}`}
            classNames={{
              svg: 'w-12 h-12',
              indicator: 'stroke-white',
              track: 'stroke-white/20',
              value: 'text-xxs font-nunito text-white',
              label: 'text-xs font-nunito',
            }}
            showValueLabel
            valueLabel={<div> {isCompleted ? 'Done' : `${percentage}%`} </div>}
          />
        </div>
      </div>
    </div>
  );
}
