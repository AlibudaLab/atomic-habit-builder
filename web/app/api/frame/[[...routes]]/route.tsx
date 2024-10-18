/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import queryString from 'query-string';
import { getRandomGif } from '../utils/getter';
import { gifUrls } from '../utils/constants';
import { CLIENT_BASE_URL } from '@/constants';

const app = new Frog({
  basePath: '/api/frame',
  title: 'Atomic Frame',
});

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const { url } = c.req;
  const parsedUrl = queryString.parseUrl(url);
  const { challenge_id: challengeId, ...allParams } = parsedUrl.query;

  const safeType =
    (allParams.type as string) in gifUrls ? (allParams.type as keyof typeof gifUrls) : 'Run';

  const queryParams = queryString.stringify(allParams);
  const imageUrl = allParams.polyline
    ? `${CLIENT_BASE_URL}/frame/activity?${queryParams}`
    : getRandomGif(gifUrls[safeType]);

  const refLinkUrl =
    typeof challengeId === 'string'
      ? `${CLIENT_BASE_URL}/habit/stake/${challengeId}`
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
