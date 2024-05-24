import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { SetStateAction, useState } from 'react';
import { StravaRunData, StravaWorkoutData } from '@/utils/strava';
import { getActivityDuration, timeDifference } from '@/utils/time';

const isRunData = (data: StravaRunData | StravaWorkoutData): data is StravaRunData => {
  return (data as StravaRunData).distance !== undefined;
}

export function ActivityDropDown({
  setActivityIdx,
  activityIdx,
  activities,
}: {
  setActivityIdx: React.Dispatch<SetStateAction<number>>;
  activityIdx: number;
  activities: StravaRunData[] | StravaWorkoutData[];
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
                <div className="px-2 text-xs">
                  {getActivityDuration(activities[activityIdx].moving_time)}{' '}
                </div>
                { isRunData(activities[activityIdx]) && 
                  <div className="px-2 text-xs">
                  {' '}
                  {((activities[activityIdx] as StravaRunData).distance / 1000).toPrecision(2)} KM{' '}
                </div>}
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
                  <p className="text-lg"> Select a record </p>
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
            {activities.map((activity, idx) => {
              const isChosen = activityIdx === idx;
              return (
                <button
                  type="button"
                  style={{ width: '320px' }}
                  className="p-2 hover:bg-white"
                  key={activity.id}
                  onClick={() => {
                    setActivityIdx(idx);
                    setOpen(false);
                  }}
                >
                  <div className={`px-2 text-sm font-bold ${isChosen && 'text-primary'}`}>
                    {' '}
                    {activity.name}{' '}
                  </div>
                  <div className="flex justify-center gap-4 ">
                    <div className={`flex items-center px-2 ${isChosen && 'text-primary'}`}>
                      <div className="px-2 text-xs">
                        {' '}
                        {getActivityDuration(activity.moving_time)}{' '}
                      </div>
                      { 
                      isRunData(activity) &&
                      <div className="px-2 text-xs">
                        {' '}
                        {(activity.distance / 1000).toPrecision(2)} KM{' '}
                      </div>}
                      <div className="px-2 text-xs">
                        {' '}
                        {timeDifference(Date.now(), Date.parse(activity.timestamp))}{' '}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </DropdownMenu.Content>
        )}
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
