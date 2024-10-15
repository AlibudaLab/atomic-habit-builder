/* eslint-disable */
'use client';

import { ChallengeWithCheckIns } from '@/types';
import { ChallengePreview } from './ChallengeBox';
import { useRouter } from 'next/navigation';
import NewUser from './NewUser';
import { logEventSimple } from '@/utils/gtag';
import { useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { FaSort } from 'react-icons/fa';
import { UserChallengeStatus } from '@/types';
import { sortChallenges, SortOption } from '../utils/sortChallenges';

type DashboardProps = {
  onGoingChallenges: ChallengeWithCheckIns[];
  totalChallengeCount: number;
};

export default function Dashboard({ onGoingChallenges, totalChallengeCount }: DashboardProps) {
  const { push } = useRouter();
  const [sortBy, setSortBy] = useState<SortOption>('status');

  const sortedChallenges = sortChallenges(onGoingChallenges, sortBy);

  return totalChallengeCount === 0 ? (
    <NewUser />
  ) : (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      <div className="relative flex w-full items-center justify-between px-4 py-4">
        <div className="w-1/3" />
        <p className="absolute left-1/2 my-4 -translate-x-1/2 transform font-londrina text-xl font-bold">
          My Challenges
        </p>
        <div className="flex w-1/3 justify-end">
          <Dropdown>
            <DropdownTrigger>
              <Button variant="light" size="sm">
                <FaSort className="mr-2" />
                Sort
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort challenges"
              onAction={(key) => setSortBy(key as SortOption)}
            >
              <DropdownItem key="status">Status</DropdownItem>
              <DropdownItem key="stakes">Stakes</DropdownItem>
              <DropdownItem key="startTimestamp">Start Date</DropdownItem>
              <DropdownItem key="endTimestamp">End Date</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {sortedChallenges.length == 0 && (
        <div className="flex flex-col items-center justify-center">
          <p className="m-4 mt-8 text-center font-nunito text-base">
            No ongoing challenges, try joining one!
          </p>
        </div>
      )}

      {sortedChallenges.map((challenge, idx) => (
        <button
          type="button"
          key={`link-${idx}`}
          onClick={() => {
            push(`/habit/checkin/${challenge.id}`);
            logEventSimple({ eventName: 'click_challenge_joined_ongoing', category: 'browse' });
          }}
          className="w-full transition-transform duration-100 focus:scale-105"
        >
          <ChallengePreview
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}

      <button
        onClick={() => {
          push('/habit/history');
          logEventSimple({ eventName: 'click_challenge_history', category: 'browse' });
        }}
        className="my-6 py-4 text-dark"
      >
        <p className="font underline"> Challenge History </p>
      </button>
    </div>
  );
}
