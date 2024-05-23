import { clsx } from 'clsx';
import { SetStateAction, useState } from 'react';
import { challengeToEmoji } from '@/utils/challenges';
import { Challenge } from '@/types';
import useAllChallenges from '@/hooks/useAllChallenges';
import { formatDuration } from '@/utils/timestamp';

export function ChallengesDropDown({
  setSelectedChallenge,
  selectedChallenge,
  onChoose,
}: {
  setSelectedChallenge: React.Dispatch<SetStateAction<Challenge | null>>;
  selectedChallenge: Challenge | null;
  onChoose: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);

  const { challenges } = useAllChallenges();

  return (
    
        <div className=" flex w-full items-center justify-start gap-4">
          <div className="flex justify-start rounded-md border border-solid">
            {selectedChallenge ? (
              <>
                <div className="p-2 text-2xl"> {challengeToEmoji(selectedChallenge.type)} </div>
                <button onClick={() => setOpen(true)} type="button" style={{ width: '220px' }}>
                  <div className="flex flex-col items-start justify-start p-2">
                    <p className="text-xs opacity-80">
                      {formatDuration(
                        selectedChallenge.startTimestamp,
                        selectedChallenge.endTimestamp,
                      )}{' '}
                    </p>
                    <p className="text-sm">{selectedChallenge.name}</p>
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="p-2 text-2xl"> + </div>
                <button onClick={() => setOpen(true)} type="button" style={{ width: '220px' }}>
                  <div className="flex flex-col items-start justify-start p-2">
                    <p className="text-sm"> Select One </p>
                  </div>
                </button>
              </>
            )}
          </div>
        </div>
        // {open && (
          
        //     {challenges.map((challenge) => (
        //       <button
        //         type="button"
        //         style={{ borderColor: 'grey', width: '320px' }}
        //         className="bg-light p-2 text-center hover:opacity-80"
        //         // label={challenge.name}
        //         key={challenge.id.toString()}
        //         onClick={() => {
        //           onChoose(challenge.id.toString());
        //           setOpen(false);
        //         }}
        //       >
        //         <div className="flex justify-start">
        //           <div className="p-2 text-2xl"> {challengeToEmoji(challenge.type)} </div>
        //           <div className="flex flex-col items-start justify-start p-2">
        //             <p className="text-xs opacity-80">
        //               {formatDuration(challenge.startTimestamp, challenge.endTimestamp)}
        //             </p>
        //             <p className="text-sm">{challenge.name}</p>
        //           </div>
        //         </div>
        //       </button>
        //     ))}
        // )}
  );
}
