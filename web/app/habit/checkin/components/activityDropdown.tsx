import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { SetStateAction, useState } from 'react';
import { StravaRunData, StravaWorkoutData } from '@/utils/strava';
import { getActivityDuration, timeDifference } from '@/utils/time';
import { PulseLoader } from 'react-spinners';

const isRunData = (data: StravaRunData | StravaWorkoutData): data is StravaRunData => {
  return (data as StravaRunData).distance !== undefined;
};

export function ActivityDropDown({
  setActivityIdx,
  loading,
  activityIdx,
  activities,
  usedActivities,
}: {
  loading: boolean;
  setActivityIdx: React.Dispatch<SetStateAction<number>>;
  activityIdx: number;
  activities: StravaRunData[] | StravaWorkoutData[];
  usedActivities: string[];
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
                {isRunData(activities[activityIdx]) && (
                  <div className="px-2 text-xs">
                    {' '}
                    {((activities[activityIdx] as StravaRunData).distance / 1000).toPrecision(
                      2,
                    )} KM{' '}
                  </div>
                )}
                <div className="text-grey px-2 text-xs">
                  {' '}
                  {timeDifference(Date.now(), Date.parse(activities[activityIdx].timestamp))}{' '}
                </div>
              </div>
            </button>
          ) : loading ? (
            <button onClick={() => setOpen(true)} type="button">
              <div className="flex flex-col justify-center p-2 text-center">
                <PulseLoader color="#ff784f" />{' '}
              </div>
            </button>
          ) : activities.length === 0 ? (
            <button disabled type="button">
              <div className="flex flex-col justify-center p-2 text-center">
                <p className="text-sm font-bold text-primary"> No Activities Found </p>
              </div>
            </button>
          ) : (
            <button disabled type="button">
              <div className="flex flex-col justify-center p-2 text-center">
                <p className="text-sm font-bold text-primary"> Select a Record </p>
              </div>
            </button>
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
              const isUsed = usedActivities.includes(activity.id.toString());
              const isChosen = activityIdx === idx;
              return (
                <button
                  type="button"
                  style={{ width: '320px' }}
                  className={`p-2 ${isUsed && 'opacity-50'}`}
                  key={activity.id}
                  onClick={() => {
                    setActivityIdx(idx);
                    setOpen(false);
                  }}
                  disabled={isUsed}
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
                      {isRunData(activity) && (
                        <div className="px-2 text-xs">
                          {' '}
                          {(activity.distance / 1000).toPrecision(2)} KM{' '}
                        </div>
                      )}
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
