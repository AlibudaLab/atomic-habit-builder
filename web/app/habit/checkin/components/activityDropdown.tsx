import { StravaData, StravaRunData } from '@/utils/strava';
import { getActivityDuration, timeDifference } from '@/utils/time';
import { Select, SelectItem } from '@nextui-org/select';

import { CheckInFields } from '@/hooks/transaction/useCheckInRun';
import { logEventSimple } from '@/utils/gtag';

const hasDistance = (data: StravaData) => {
  return (data as StravaRunData).distance !== undefined;
};

export function ActivityDropDown({
  isDisabled,
  fields,
  onActivitySelect,
  loading,
  activities,
  usedActivities,
}: {
  isDisabled: boolean;
  fields: CheckInFields;
  onActivitySelect: (activityId: number) => void;
  loading: boolean;
  activities: StravaData[];
  usedActivities: string[];
}) {
  const noActivities = activities && activities.length === 0 && !loading;

  return (
    <div className=" flex w-full items-center justify-center">
      <Select
        label={noActivities ? 'No matched record' : 'Select an activity'}
        className="w-full max-w-xs"
        value={fields.activityId}
        disabledKeys={usedActivities}
        isLoading={loading}
        isDisabled={isDisabled}
      >
        {activities.map((activity: StravaData) => {
          const isChosen = fields.activityId === activity.id;
          return (
            <SelectItem
              key={activity.id.toString()}
              onClick={() => {
                onActivitySelect(activity.id);
                logEventSimple({ eventName: 'click_strava_reocrd', category: 'checkin' });
              }}
              textValue={`${activity.name} (${timeDifference(
                Date.now(),
                Date.parse(activity.timestamp),
              )})`}
            >
              <div className="flex flex-col items-center gap-2">
                {' '}
                <div className={`text-xs font-bold ${isChosen && 'text-primary'}`}>
                  {' '}
                  {activity.name}{' '}
                </div>
                <div className="flex justify-start gap-2">
                  {' '}
                  <div className={`flex items-center gap-2 ${isChosen && 'text-primary'}`}>
                    <div className="text-xs"> {getActivityDuration(activity.moving_time)}</div>
                    {hasDistance(activity) && (
                      <div className="ml-1 text-xs">
                        {' '}
                        {((activity as StravaRunData).distance / 1000).toPrecision(2)} KM
                      </div>
                    )}
                    <div className="ml-1 text-xs">
                      {' '}
                      {timeDifference(Date.now(), Date.parse(activity.timestamp))}
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
