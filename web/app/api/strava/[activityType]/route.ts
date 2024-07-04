import { NextRequest, NextResponse } from 'next/server';
import { activityToStravaTypes } from '../utils';

/**
 * @param req
 * @param res
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { activityType: string } },
): Promise<Response> {
  const activityTypeKey = params.activityType;
  if (!activityTypeKey)
    return NextResponse.json({ error: 'activityType is required' }, { status: 400 });

  const activityTypes = activityToStravaTypes[activityTypeKey];

  const before = req.nextUrl.searchParams.get('before') ?? Math.floor(new Date().getTime() / 1000);
  const after =
    req.nextUrl.searchParams.get('after') ??
    Math.floor((new Date().getTime() - 86400000 * 30) / 1000);
  const page = req.nextUrl.searchParams.get('page') ?? 1;
  const perPage = req.nextUrl.searchParams.get('perPage') ?? 100;
  const accessToken = req.nextUrl.searchParams.get('accessToken');

  try {
    if (!accessToken) {
      return NextResponse.json({ error: 'accessToken is required' }, { status: 400 });
    }

    const url = `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const activities = (await response.json()).filter((activity: any) =>
      activityTypes.includes(activity.type),
    );

    if (activityTypeKey === 'workout') {
      return NextResponse.json(
        {
          activities: activities.map((activity: any) => {
            return {
              id: activity.id,
              name: activity.name,
              moving_time: activity.moving_time,
              timestamp: activity.start_date,
            };
          }),
        },
        { status: 200 },
      );
    } else if (activityTypeKey === 'run') {
      return NextResponse.json(
        {
          activities: activities.map((activity: any) => {
            return {
              id: activity.id,
              name: activity.name,
              distance: activity.distance,
              moving_time: activity.moving_time,
              map: activity.map,
              max_heartrate: activity.max_heartrate,
              timestamp: activity.start_date,
            };
          }),
        },
        { status: 200 },
      );
    } else {
      return NextResponse.json({ error: 'Invalid activity type' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error getting Strava workouts:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
