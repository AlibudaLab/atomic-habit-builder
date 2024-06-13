import { Metadata } from 'next';
import { NextUIProvider } from '@nextui-org/system';
import HomePage from './home/HomePage';

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

/**
 * Server component, which imports the Home component (client component that has 'use client' in it)
 * https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts
 * https://nextjs.org/docs/pages/building-your-application/upgrading/app-router-migration#step-4-migrating-pages
 * https://nextjs.org/docs/app/building-your-application/rendering/client-components
 */
export default function Page() {
  return (
    <NextUIProvider>
      <HomePage />
    </NextUIProvider>
  );
}
