import { activityToStravaTypes } from 'app/api/strava/utils';

export const SEPERATOR = 'STRAVA_SECRET_SEPARATOR';

export type StravaRunData = {
  id: number;
  name: string;
  timestamp: string;
  distance: number;
  max_heartrate: number;
  moving_time: number;
  map: {
    summary_polyline: string;
  };
};

export type StravaWorkoutData = {
  id: number;
  name: string;
  timestamp: string;
  moving_time: number;
};

export type StravaCyclingData = {
  id: number;
  name: string;
  timestamp: string;
  distance: number;
  moving_time: number;
  map: {
    summary_polyline: string;
  };
};

export type StravaSwimData = {
  id: number;
  name: string;
  timestamp: string;
  distance: number;
  moving_time: number;
  total_strokes?: number;
  average_stroke_rate?: number;
};

export type StravaData = StravaRunData | StravaWorkoutData | StravaCyclingData | StravaSwimData;

export function getAuthURL(redirectURL: string, original_path?: string | null) {
  const stravaAuthUrl = 'https://www.strava.com/oauth/authorize';
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const responseType = 'code';
  const approvalPrompt = 'force';
  const scope = 'activity:read_all';

  let authUrl = `${stravaAuthUrl}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectURL}&approval_prompt=${approvalPrompt}&scope=${scope}`;
  if (original_path) authUrl += `&state=${original_path}`;

  return authUrl;
}

export async function getAccessAndRefreshToken(authToken: string) {
  const fetchURL = `/api/strava/auth?authToken=${authToken}`;

  const response = await (
    await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

  return {
    accessToken: response.access_token as string,
    refreshToken: response.refresh_token as string,
    expiry: response.expiry as number,
  };
}

export function splitSecret(secret: string) {
  const [accessToken, refreshToken] = secret.split(SEPERATOR);
  return { accessToken, refreshToken };
}

export function joinSecret(accessToken: string, refreshToken: string) {
  return `${accessToken}${SEPERATOR}${refreshToken}`;
}

export async function fetchActivities(
  accessToken: string,
  activityType: string,
  startTimestamp: number,
  endTimestamp: number,
) {
  const fetchURL = `/api/strava/${activityType}?accessToken=${accessToken}&before=${endTimestamp}&after=${startTimestamp}`;

  const response = (await (
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()) as { activities: StravaData[] };

  return response.activities;
}

export async function refreshAccessToken(refreshToken: string) {
  const fetchURL = `/api/strava/refresh?refreshToken=${refreshToken}`;

  const response = await (
    await fetch(fetchURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json();

  return {
    accessToken: response.access_token as string,
    expiry: response.expiry as number,
  };
}

export function categorizeActivity(activity: any): string | null {
  const activityType = activity.type;
  for (const [category, types] of Object.entries(activityToStravaTypes)) {
    if (types.includes(activityType)) {
      return category;
    }
  }
  return null;
}
