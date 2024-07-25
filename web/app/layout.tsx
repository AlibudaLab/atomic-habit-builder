'use client';

import './global.css';

import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import OnchainProviders from '@/OnchainProviders';
import { NextUIProvider } from '@nextui-org/system';
import { initAnalytics } from '@/utils/analytics';
import { roboto, londrina } from './fonts';
import NavbarFooter from './habit/components/NavbarFooter';
import Header from './habit/components/Header';

// Stat analytics before the App renders,
// so we can track page views and early events
initAnalytics();

/** Root layout to define the structure of every page
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${roboto.className} ${londrina.variable} ${roboto.variable}`}>
      <body className="flex flex-1 flex-col items-center pb-[100px]">
        <OnchainProviders>
          <NextUIProvider>
            <div className="container mx-auto flex max-w-[500px] flex-col items-center bg-white pt-16">
              <Header />
              {children}
              <NavbarFooter />
            </div>
          </NextUIProvider>
        </OnchainProviders>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
