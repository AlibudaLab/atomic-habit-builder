/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import { getRandomGif } from '../utils/getter';
import { gifUrls } from '../utils/constants';

const app = new Frog({ basePath: '/api/frame', title: 'Atomic Frame' });

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const { searchParams } = new URL(c.req.url);
  const refLink = searchParams.get('ref_link');
  const polyline = searchParams.get('polyline');
  const type = (searchParams.get('type') as keyof typeof gifUrls) ?? 'run';
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000';
  searchParams.delete('routes');
  searchParams.delete('ref_link');

  const imageUrl = polyline
    ? `${baseUrl}/frame/activity?${searchParams.toString()}`
    : getRandomGif(gifUrls[type] ?? gifUrls.run);

  return c.res({
    image: imageUrl,
    intents: [
      <Button.Link href={refLink ?? ''}>
        {refLink ? '🏆 Compete with Me' : 'DM for Invite Link'}
      </Button.Link>,
      <Button.Link href="https://bit.ly/atomic_notion_warpcast">🌱 What is Atomic</Button.Link>,
      <Button.Link href={`https://${process.env.VERCEL_URL}`}>Test VERCEL_URL</Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
