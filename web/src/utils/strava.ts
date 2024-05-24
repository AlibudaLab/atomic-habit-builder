export const SEPERATOR = 'STRAVA_SECRET_SEPARATOR';

export type StravaRunData = {
  id: number;
  name: string;
  timestamp: string;
  distance: number;
  max_heartrate: number;
  moving_time: number;
};

export type StravaWorkoutData = {
  id: number;
  name: string;
  timestamp: string;
  moving_time: number;
};


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

export async function fetchRuns(accessToken: string) {
  const fetchURL = `/api/strava/runs?accessToken=${accessToken}`;

  const response = (await (
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()) as { runData: StravaRunData[] };

  return response.runData;
}

export async function fetchWorkouts(accessToken: string) {
  const fetchURL = `/api/strava/workout?accessToken=${accessToken}`;

  const response = (await (
    await fetch(fetchURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
  ).json()) as { workouts: StravaWorkoutData[] };

  return response.workouts;
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
