import { Londrina_Solid, Nunito } from 'next/font/google';

export const londrina = Londrina_Solid({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '900'],
  variable: '--font-title',
});

export const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-normal',
});
