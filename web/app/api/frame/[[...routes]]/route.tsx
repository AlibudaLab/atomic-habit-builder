/* eslint-disable react/jsx-key */
/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog';
import { handle } from 'frog/next';
import { NEXT_PUBLIC_URL } from '../config';

const app = new Frog({
  basePath: '/api/frame',
  title: 'Atomic Frame',
});

export const runtime = 'edge';

app.frame('/activity', (c) => {
  const url = new URL(c.req.url);
  const searchParams = url.searchParams;
  const refLink = searchParams.get('ref_link');
  searchParams.delete('routes');
  searchParams.delete('ref_link');
  const imageSearchParams = new URLSearchParams(searchParams);
  const imageUrl = `${NEXT_PUBLIC_URL}/frame/activity?${imageSearchParams.toString()}`;
  return c.res({
    image: imageUrl,
    intents: [
      <Button.Link href={refLink ?? ''}>
        {refLink ? 'Join the Challenge!!' : 'DM for Invite Link'}
      </Button.Link>,
    ],
  });
});

export const GET = handle(app);
export const POST = handle(app);
