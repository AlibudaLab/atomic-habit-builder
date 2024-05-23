import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { SetStateAction, useState } from 'react';
import { StravaActivity } from '@/utils/strava';
import { timeDifference } from '@/utils/time';

export function ActivityDropDown({
  setActivityIdx,
  activityIdx,
  activities,
}: {
  setActivityIdx: React.Dispatch<SetStateAction<number>>;
  activityIdx: number;
  activities: StravaActivity[];
}) {
  const [open, setOpen] = useState(true);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <div className="wrapped m-2 flex w-full max-w-80 justify-center p-2">
          {activityIdx !== -1 ? (
            <button type="button" onClick={() => setOpen(true)}>
              <div className="px-2 text-sm font-bold"> {activities[activityIdx].name} </div>
              <div className="flex items-center px-2">
                {/* <div className="px-2 text-xs"> {(activities[activityIdx].distance / 1000).toPrecision(2)} KM </div> */}
                <div className="text-grey px-2 text-xs">
                  {' '}
                  {timeDifference(Date.now(), Date.parse(activities[activityIdx].timestamp))}{' '}
                </div>
              </div>
            </button>
          ) : (
            <>
              <div className="p-2 text-2xl"> + </div>
              <button onClick={() => setOpen(true)} type="button" style={{ width: '220px' }}>
                <div className="flex flex-col items-start justify-start p-2">
                  <p className="text-sm"> Select An Activity </p>
                </div>
              </button>
            </>
          )}
        </div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        {open && (
          <DropdownMenu.Content
            align="end"
            sideOffset={0}
            className={clsx(
              'w-120 inline-flex flex-col items-start justify-start',
              'bg-light rounded-lg border-solid shadow',
            )}
          >
            {activities.map((activity, idx) => (
              <button
                type="button"
                style={{ width: '320px'}}
                className="hover:text-primary p-2 text-center"
                key={activity.id}
                onClick={() => {
                  setActivityIdx(idx);
                  setOpen(false);
                }}
              >
                <div className="px-2 text-sm font-bold"> {activity.name} </div>
                <div className="flex justify-center gap-4 hover:text-yellow">
                  <div className="flex items-center px-2 hover:text-yellow">
                    <div className="px-2 text-xs">
                      {' '}
                      {(activity.distance / 1000).toPrecision(2)} KM{' '}
                    </div>
                    <div className="text-grey px-2 text-xs hover:text-yellow">
                      {' '}
                      {timeDifference(Date.now(), Date.parse(activity.timestamp))}{' '}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </DropdownMenu.Content>
        )}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
