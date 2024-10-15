'use client';

import { ChallengePreview } from '../../components/ChallengeBox';
import { useRouter } from 'next/navigation';
import { useUserChallenges } from '@/providers/UserChallengesProvider';
import moment from 'moment';
import { useMemo, useState } from 'react';
import { UserChallengeStatus } from '@/types';
import { logEventSimple } from '@/utils/gtag';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@nextui-org/react';
import { FaSort } from 'react-icons/fa';
import { sortChallenges, SortOption } from '../../utils/sortChallenges';

function HistoryContent() {
  const { push } = useRouter();
  const { data: challenges } = useUserChallenges();
  const [sortBy, setSortBy] = useState<SortOption>('status');

  // all past challenges, excluding "claimable" ones
  const finishedChallenges = useMemo(
    () =>
      challenges
        ? challenges.filter(
            (c) => c.endTimestamp < moment().unix() && c.status != UserChallengeStatus.Claimable,
          )
        : [],
    [challenges],
  );

  const sortedChallenges = sortChallenges(finishedChallenges, sortBy);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      <div className="relative flex w-full items-center justify-between px-4">
        <div className="w-1/3" /> {/* Spacer */}
        <p className="absolute left-1/2 my-4 -translate-x-1/2 transform font-londrina text-xl font-bold">
          {sortedChallenges.length > 0 ? 'Challenge History' : 'No Challenge History'}
        </p>
        <div className="flex w-1/3 justify-end">
          {' '}
          {/* Right-aligned container */}
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

      {/* map challenges to list of buttons */}
      {sortedChallenges.map((challenge) => (
        <button
          type="button"
          key={`link-${challenge.id}`}
          onClick={() => {
            const failed = challenge.minimumCheckIns > challenge.checkedIn;
            push(`/habit/checkin/${challenge.id}`);
            logEventSimple({
              eventName: failed
                ? 'click_challenge_joined_failed'
                : 'click_challenge_joined_completed',
              category: 'browse',
            });
          }}
          className="w-full no-underline transition-transform duration-200 focus:scale-105"
        >
          <ChallengePreview
            key={challenge.id.toString()}
            challenge={challenge}
            checkedIn={challenge.checkedIn}
          />
        </button>
      ))}
    </div>
  );
}

export default HistoryContent;
