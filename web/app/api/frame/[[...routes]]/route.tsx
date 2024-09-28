/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import queryString from 'query-string';
import { getRandomGif } from '../utils/getter';
import { gifUrls } from '../utils/constants';
import { decodePolyline } from '@/utils/urls';

const app = new Frog({
  basePath: '/api/frame',
  title: 'Atomic Frame',
  imageOptions: {
    width: 1200,
    height: 630,
  },
});

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const { url } = c.req;
  const parsedUrl = queryString.parseUrl(url);
  const { challenge_id: challengeId, ...allParams } = parsedUrl.query;

  allParams.name =
    typeof allParams.name === 'string'
      ? decodeURIComponent(allParams.name).replace(/_/g, ' ')
      : 'Atomic Habit Challenge';

  allParams.polyline =
    typeof allParams.polyline === 'string' ? decodePolyline(allParams.polyline) : '';

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';

  const safeType =
    (allParams.type as string) in gifUrls ? (allParams.type as keyof typeof gifUrls) : 'Run';

  const queryParams = queryString.stringify(allParams);
  const imageUrl = allParams.polyline
    ? `${baseUrl}/frame/activity?${queryParams}`
    : getRandomGif(gifUrls[safeType]);

  const refLinkUrl =
    typeof challengeId === 'string'
      ? `${baseUrl}/habit/stake/${challengeId}`
      : 'https://t.me/alibuda_feedback/1';

  return c.res({
    image: imageUrl,
    intents: [
      <Button.Link href={refLinkUrl}>
        {challengeId ? '🏆 Compete with Me' : 'DM for Invite Link'}
      </Button.Link>,
      <Button.Link href="https://bit.ly/atomic_notion_warpcast">🌱 What is Atomic</Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
