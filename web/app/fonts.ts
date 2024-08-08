import { Londrina_Solid, Nunito } from 'next/font/google';

export const londrina = Londrina_Solid({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300'],
  variable: '--font-londrina',
});

export const roboto = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-nunito',
});
