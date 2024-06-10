import { StravaRunData, StravaWorkoutData } from '@/utils/strava';
import { getActivityDuration, timeDifference } from '@/utils/time';
import { Select, SelectItem } from '@nextui-org/select';

import { CheckInFields } from '@/hooks/transaction/useCheckInRun';

const isRunData = (data: StravaRunData | StravaWorkoutData): data is StravaRunData => {
  return (data as StravaRunData).distance !== undefined;
};

export function ActivityDropDown({
  fields,
  onActivitySelect,
  loading,
  activities,
  usedActivities,
}: {
  fields: CheckInFields;
  onActivitySelect: (activityId: number) => void;
  loading: boolean;
  activities: StravaRunData[] | StravaWorkoutData[];
  usedActivities: string[];
}) {
  return (
    <div className="m-2 flex min-h-16 w-full max-w-80 p-2">
      <Select
        label="Select an activity"
        className="max-w-xs"
        value={fields.activityId}
        disabledKeys={usedActivities}
        isLoading={loading}
      >
        {activities.map((activity: StravaRunData | StravaWorkoutData) => {
          const isChosen = fields.activityId === activity.id;
          return (
            <SelectItem
              key={activity.id.toString()}
              // eslint-disable-next-line react-perf/jsx-no-new-function-as-prop
              onClick={() => {
                onActivitySelect(activity.id);
              }}
              textValue={`${activity.name} (${timeDifference(
                Date.now(),
                Date.parse(activity.timestamp),
              )})`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`text-sm font-bold ${isChosen && 'text-primary'}`}>
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
              </div>
            </SelectItem>
          );
        })}
      </Select>
    </div>
  );
}
