'use client';

import { logEventSimple } from '@/utils/gtag';
import { QueryParams, urlWithQueryParams } from '@/utils/urls';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useSocialShare() {
  const path = usePathname();

  const [fullPathShare, setFullPathShare] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setFullPathShare(`${window.location.origin}${path}`);
  }, [path]);

  const open = (url: string) => {
    window.open(url, '_blank');
  };

  const shareOnX = (text: string, url: string = fullPathShare, via = 'alibuda_builder') => {
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.set('text', text);
    shareUrl.searchParams.set('via', via);
    shareUrl.searchParams.set('url', url);
    open(shareUrl.toString());
    logEventSimple({ eventName: 'click_facaster_share', category: 'share' });
  };

  const shareOnTelegram = (text: string, url: string = fullPathShare) => {
    const shareUrl = new URL('https://t.me/share/url');
    shareUrl.searchParams.set('url', url);
    shareUrl.searchParams.set('text', text);
    open(shareUrl.toString());
  };

  const shareOnFarcaster = (text: string, url: string = fullPathShare) => {
    const shareParams: QueryParams = {
      'embeds[]': url,
      text: text,
    };

    const shareUrl = urlWithQueryParams('https://warpcast.com/~/compose', shareParams);

    console.log('shareUrl: ', shareUrl);

    window.open(shareUrl, '_blank');
    logEventSimple({ eventName: 'click_farcaster_share', category: 'share' });
  };

  return {
    shareOnX,
    shareOnTelegram,
    shareOnFarcaster,
  };
}
