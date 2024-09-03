import { Challenge, ChallengeWithCheckIns } from '@/types';
import { challengeToEmoji, getUserChallengeStatus } from '@/utils/challenges';
import { formatDuration } from '@/utils/timestamp';
import moment from 'moment';
import { CircularProgress } from '@nextui-org/react';

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

function FractionDisplay({ numerator, denominator }: { numerator: number; denominator: number }) {
  return (
    <div className="inline-flex flex-col items-center">
      <span className="text-xs">{numerator}</span>
      <div className="h-px w-full bg-white" />
      <span className="text-xs">{denominator}</span>
    </div>
  );
}

export function ChallengePreview({
  challenge,
  checkedIn,
  fullWidth,
}: {
  challenge: ChallengeWithCheckIns;
  checkedIn: number;
  fullWidth?: boolean;
}) {
  const userChallengeStatus = getUserChallengeStatus(challenge);
  console.log('userChallengeStatus', userChallengeStatus)

  const isPast = challenge.endTimestamp < moment().unix();

  let percentage = (checkedIn * 100) / challenge.targetNum;

  const isCompleted = checkedIn >= challenge.targetNum;

  return (
    <div
      className={`wrapped-filled p-2 transition-transform duration-300 focus:scale-105 ${
        isPast ? 'opacity-50' : ''
      } ${fullWidth ? 'w-full' : 'm-2'}`}
    >
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <p className="text-xs opacity-80">
            {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
          </p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-xs">
            {' '}
            {challenge.public ? 'Public' : 'Private'} | {userChallengeStatus}
          </p>
        </div>
        <div className="ml-auto min-w-[64px] p-2 text-lg ">
          <CircularProgress
            value={percentage}
            size="lg"
            classNames={{
              svg: 'w-14 h-14',
              indicator: 'stroke-white stroke-[1.5px]',
              track: 'stroke-white/20 stroke-[1.5px]',
              value: 'text-xs font-nunito text-white',
              label: 'text-xs font-nunito',
            }}
            showValueLabel
            valueLabel={
              isCompleted ? (
                <div> Claim </div>
              ) : (
                <div className="flex flex-col gap-0">
                  <FractionDisplay numerator={checkedIn} denominator={challenge.targetNum} />
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
