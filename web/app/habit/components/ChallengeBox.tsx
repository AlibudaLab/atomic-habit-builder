import { Challenge } from '@/types';
import { challengeToEmoji } from '@/utils/challenges';
import { formatDuration } from '@/utils/timestamp';

export function ChallengeBox({ challenge }: { challenge: Challenge }) {
  return (
    <div className="wrapped m-4 w-full">
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="text-primary flex flex-col items-start justify-start p-2">
          <p className="text-xs font-bold opacity-80">
            {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
          </p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> 5 joined </p>
        </div>
        <div className="ml-auto p-2 text-sm font-bold">{challenge.targetNum} times</div>
      </div>
    </div>
  );
}

export function ChallengeBoxFilled({
  challenge,
  checkedIn,
}: {
  challenge: Challenge;
  checkedIn?: number;
}) {
  return (
    <div className="wrapped-filled m-2 w-full p-2">
      <div className="flex w-full items-center justify-start no-underline">
        <div className="p-2 text-3xl"> {challengeToEmoji(challenge.type)} </div>
        <div className="flex flex-col items-start justify-start p-2">
          <p className="text-xs opacity-80">
            {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
          </p>
          <p className="text-start text-sm font-bold">{challenge.name}</p>
          <p className="text-sm"> 5 joined </p>
        </div>
        {
          // if checkedIn is defined, show the checkedIn number, otherwise show the target number
          checkedIn !== undefined ? (
            <div className="ml-auto p-2 text-lg">
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
