import { NextRequest, NextResponse } from 'next/server';

/**
 * @param req
 * @param res
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Your code to handle authentication to Strava goes here
  try {
    const before =
      req.nextUrl.searchParams.get('before') ?? Math.floor(new Date().getTime() / 1000);
    const after =
      req.nextUrl.searchParams.get('after') ??
      Math.floor((new Date().getTime() - 86400000 * 20) / 1000);
    const page = req.nextUrl.searchParams.get('page') ?? 1;
    const perPage = req.nextUrl.searchParams.get('perPage') ?? 10;
    const accessToken = req.nextUrl.searchParams.get('accessToken');
    if (!accessToken) {
      return NextResponse.json({ error: 'accessToken is required' }, { status: 400 });
    }

    console.log('before:', before);
    console.log('after:', after);
    console.log('page:', page);
    console.log('perPage:', perPage);

    const url = `https://www.strava.com/api/v3/athlete/activities?before=${before}&after=${after}&page=${page}&per_page=${perPage}`;

    const response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    const activities = await response.json();
    // console.log(activities);
    // Go through the activities filter where type == "Run"
    // And get "name", "distance", "moving_time", "map", "max_heartrate"
    const runs = activities.filter((activity: any) => activity.type === 'Run');
    console.log(runs);
    const runData = runs.map((run: any) => {
      return {
        id: run.id,
        name: run.name,
        distance: run.distance,
        moving_time: run.moving_time,
        map: run.map,
        max_heartrate: run.max_heartrate,
        timestamp: run.start_date,
      };
    });
    console.log(runData);

    return NextResponse.json({ runData }, { status: 200 });
  } catch (error) {
    console.error('Error getting Strava AuthToken:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
