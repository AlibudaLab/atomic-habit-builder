import { Roboto_Mono, Nunito } from 'next/font/google';

export const roboto = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
});

export const inter = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
