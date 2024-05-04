import { Avatar } from '@coinbase/onchainkit/identity';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';

import { Challenge } from '@/hooks/useUserChallenges';
import { SetStateAction } from 'react';

import { ActivityTypes, challenges } from '@/constants';

export function ChallengesDropDown({
  setSelectedChallenge,
  selectedChallenge,
}: {
  setSelectedChallenge: React.Dispatch<SetStateAction<Challenge>>;
  selectedChallenge: Challenge;
}) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className=" flex w-full items-center justify-start gap-6">
          <button
            style={{ width: '500px' }}
            type="button"
            className="bg-light rounded-md p-2 text-center "
          >
            Choose Challenge
          </button>
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={0}
          className={clsx(
            'w-120 inline-flex flex-col items-start justify-start',
            'bg-light rounded-lg border-solid px-6 pb-2 pt-6 shadow',
          )}
        >
          {challenges.map((challenge) => (
            <button
              type="button"
              style={{ borderColor: 'grey' }}
              className="bg-light w-full border-b-2 border-dotted p-2 text-center hover:opacity-80"
              // label={challenge.name}
              key={challenge.arxAddress}
            >
              <div className="flex justify-start">
                <div className="p-2 text-2xl">
                  {' '}
                  {challenge.type === ActivityTypes.Mental ? '💚' : '💪🏻'}{' '}
                </div>
                <div className="flex flex-col items-start justify-start p-2">
                  <p className="text-sm opacity-80">{challenge.duration}</p>
                  <p>{challenge.name}</p>
                </div>
              </div>
            </button>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
