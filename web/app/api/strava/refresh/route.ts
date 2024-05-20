import { NextRequest, NextResponse } from 'next/server';

/**
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const refreshToken = req.nextUrl.searchParams.get('refreshToken');
    if (!refreshToken) {
      return NextResponse.json({ error: 'refreshToken is required' }, { status: 400 });
    }

    const url = `https://www.strava.com/api/v3/oauth/token?client_id=${process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&grant_type=refresh_token&refresh_token=${refreshToken}`;
    const response = await fetch(url, { method: 'POST' });

    const res = await response.json();
    
    if (response.status == 200) {
      return NextResponse.json(
        { access_token: res.access_token, expiry: res.expires_at },
        { status: 200 },
      );
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Error Refreshing Access Token:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
