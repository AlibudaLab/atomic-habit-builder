/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import { NEXT_PUBLIC_URL } from '../config';
import { getRandomGif } from '../utils/getter';
import { gifUrls } from '../utils/constants';

const app = new Frog({
  basePath: '/api/frame',
  title: 'Atomic Frame',
});

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const url = new URL(c.req.url);
  const searchParams = url.searchParams;
  const refLink = searchParams.get('ref_link');
  const polyline = searchParams.get('polyline');
  const type = searchParams.get('type') ?? 'unknown';

  searchParams.delete('routes');
  searchParams.delete('ref_link');

  let imageUrl;
  if (polyline && polyline !== '') {
    const imageSearchParams = new URLSearchParams(searchParams);
    imageUrl = `${NEXT_PUBLIC_URL}/frame/activity?${imageSearchParams.toString()}`;
  } else {
    switch (type) {
      case 'cycling':
        imageUrl = getRandomGif(gifUrls.cycling);
        break;
      case 'run':
        imageUrl = getRandomGif(gifUrls.run);
        break;
      case 'workout':
        imageUrl = getRandomGif(gifUrls.workout);
        break;
      default:
        imageUrl = getRandomGif(gifUrls.run);
    }
  }

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
