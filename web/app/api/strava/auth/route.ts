import { NextRequest, NextResponse } from 'next/server';

/**
 * @param req
 * @param res
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Your code to handle authentication to Strava goes here
  try {
    const redirectUri = req.nextUrl.searchParams.get('redirectUri');
    if (!redirectUri) {
      return NextResponse.json({ error: 'redirectUri is required' }, { status: 400 });
    }
    
    // For example, you can redirect the user to the Strava authentication page
    const stravaAuthUrl = 'https://www.strava.com/oauth/authorize';
    const clientId = process.env.STRAVA_CLIENT_ID;
    const responseType = 'code';
    const approvalPrompt = 'force';
    const scope = 'activity:read_all';

    const authUrl = `${stravaAuthUrl}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&approval_prompt=${approvalPrompt}&scope=${scope}`;
    console.log(authUrl);

    return NextResponse.json({ authUrl }, { status: 200 });
  } catch (error) {
    console.error('Error getting Strava AuthToken:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

/**
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const authToken = req.nextUrl.searchParams.get('authToken');
    if (!authToken) {
      return NextResponse.json({ error: 'authToken is required' }, { status: 400 });
    }

    const url = `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${authToken}&grant_type=authorization_code`;
    const response = await fetch(url, { method: 'POST' });

    console.log(url);
    console.log('status: ', response.status);
    const userProfile = await response.json();
    console.log('user profile: ', userProfile);

    if (response.status == 200) {
      return NextResponse.json(
        { refresh_token: userProfile.refresh_token, access_token: userProfile.access_token },
        { status: 200 },
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Error getting Strava User Profile:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
