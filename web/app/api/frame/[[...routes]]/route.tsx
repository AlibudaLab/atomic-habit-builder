/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import { NEXT_PUBLIC_URL } from '../config';
import { getRandomGif } from '../utils/getter';
import { gifUrls } from '../utils/constants';

const app = new Frog({ basePath: '/api/frame', title: 'Atomic Frame' });

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const { searchParams } = new URL(c.req.url);
  const refLink = searchParams.get('ref_link');
  const polyline = searchParams.get('polyline');
  const type = (searchParams.get('type') as keyof typeof gifUrls) ?? 'run';
  searchParams.delete('routes');
  searchParams.delete('ref_link');

  const imageUrl = polyline
    ? `${NEXT_PUBLIC_URL}/frame/activity?${searchParams.toString()}`
    : getRandomGif(gifUrls[type] ?? gifUrls.run);

  return c.res({
    image: imageUrl,
    intents: [
      <Button.Redirect location={refLink ?? ''}>
        {refLink ? '🏆 Compete with Me' : 'DM for Invite Link'}
      </Button.Redirect>,
      <Button.Link href="https://bit.ly/atomic_notion_warpcast">🌱 What is Atomic</Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
