import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import OnchainProviders from '@/OnchainProviders';
import { initAnalytics } from '@/utils/analytics';
import { nunito, londrina } from './fonts';
import type { Metadata } from 'next';

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
};

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
    <html lang="en" className={`${nunito.className} ${londrina.className}`}>
      <body className="flex flex-1 flex-col">
        <OnchainProviders>
          <div className='lg:px-32 lg:max-w-3xl lg:mx-auto'>
          {children}
          </div>
        </OnchainProviders>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
