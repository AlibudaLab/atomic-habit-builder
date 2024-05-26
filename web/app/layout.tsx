import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import OnchainProviders from '@/OnchainProviders';
import { initAnalytics } from '@/utils/analytics';
import { roboto, londrina } from './fonts';
import type { Metadata } from 'next';

export const headers = {};

export const metadata: Metadata = {
  manifest: '/manifest.json',
  other: {
    boat: '0.17.0',
  },
};

// Stat analytics before the App renders,
// so we can track page views and early events
initAnalytics();

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.className} ${londrina.variable} ${roboto.variable}`}>
      <head>
        <link rel="manifest" href="https://progressier.app/5tDVOY8QCkShlBZ2Fdfe/progressier.json" />
        <script defer src="https://progressier.app/5tDVOY8QCkShlBZ2Fdfe/script.js" />
      </head>
      <body className="flex flex-1 flex-col">
        <OnchainProviders>
          <div className="lg:mx-auto lg:max-w-3xl lg:px-32">{children}</div>
        </OnchainProviders>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
