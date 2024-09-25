import './global.css';
import GoogleAnalytics from '@/components/GoogleAnalytics/GoogleAnalytics';
import Providers from './Providers';
import { initAnalytics } from '@/utils/analytics';
import { nunito, londrina } from './fonts';
import NavbarFooter from './habit/components/NavbarFooter';
import Header from './habit/components/Header';
import { Metadata } from 'next';
import ReferralCodeHandler from '@/components/ReferralCodeHandler';

// Stat analytics before the App renders,
// so we can track page views and early events
initAnalytics();

export const metadata: Metadata = {
  title: 'Atomic',
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
      <body className="flex flex-1 flex-col items-center bg-white">
        <Providers>
          <ReferralCodeHandler />
          <div className="container max-w-[440px] flex-1 px-4 pb-[120px] pt-8">
            <Header />
            {children}
          </div>
          <NavbarFooter />
        </Providers>
      </body>
      <GoogleAnalytics />
    </html>
  );
}
