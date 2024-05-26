import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import OnchainProviders from '@/OnchainProviders';
import { initAnalytics } from '@/utils/analytics';
import { roboto, londrina } from './fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Alibuda",
  description: "Build habits, track progress, and earn rewards",
  manifest: '/manifest.json',
  generator: "Next.js",
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/512x512.png" },
    { rel: "icon", url: "icons/512x512.png" },
  ],
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
      <body className="flex flex-1 flex-col">
        <OnchainProviders>
          <div className="lg:mx-auto lg:max-w-3xl lg:px-32">{children}</div>
        </OnchainProviders>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
