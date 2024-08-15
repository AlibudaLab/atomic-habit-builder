import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Providers from './Providers';
import { initAnalytics } from '@/utils/analytics';
import { nunito, londrina } from './fonts';
import NavbarFooter from './habit/components/NavbarFooter';
import Header from './habit/components/Header';
import { Metadata } from 'next';

// Stat analytics before the App renders,
// so we can track page views and early events
initAnalytics();

export const metadata: Metadata = {
  title: 'Alibuda',
  description: 'Build habits, track progress, and earn rewards',
  manifest: '/manifest.json',
  generator: 'Next.js',
  viewport:
    'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/512x512.png' },
    { rel: 'icon', url: 'icons/512x512.png' },
  ],
};

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${nunito.className} ${londrina.variable} ${nunito.variable}`}>
      <body className="flex flex-1 flex-col items-center pb-[100px]">
        <Providers>
          <div className="container flex max-w-[440px] flex-col items-center justify-center bg-white px-4 pt-16">
            <Header />
            {children}
            <NavbarFooter />
          </div>
        </Providers>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
