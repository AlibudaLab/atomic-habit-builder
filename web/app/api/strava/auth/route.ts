import { NextRequest, NextResponse } from 'next/server';
import { STRAVA_API_BASE_URL } from '../configs';

/**
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  const authToken = req.nextUrl.searchParams.get('authToken');
  try {
    if (!authToken) {
      return NextResponse.json({ error: 'authToken is required' }, { status: 400 });
    }

    const url = `${STRAVA_API_BASE_URL}/oauth/token?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${authToken}&grant_type=authorization_code`;
    const response = await fetch(url, { method: 'POST' });

    const userProfile = await response.json();
    console.log('user profile: ', userProfile);

    if (response.status == 200) {
      return NextResponse.json(
        {
          refresh_token: userProfile.refresh_token,
          access_token: userProfile.access_token,
          expiry: userProfile.expires_at,
        },
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
