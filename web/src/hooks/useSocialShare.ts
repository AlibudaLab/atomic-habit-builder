import { usePathname } from 'next/navigation';

const chain = 'base';

export default function () {
  const path = usePathname();

  const fullPathShare = `${window.location.origin}${path}`;

  const open = (url: string) => {
    window.open(url, '_blank');
  };

  const shareOnX = (text: string, url: string = fullPathShare, via: string = 'alibuda_builder') => {
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.set('text', text);
    shareUrl.searchParams.set('via', via);
    shareUrl.searchParams.set('url', url);
    open(shareUrl.toString());
  };

  const shareOnTelegram = (text: string, url: string = fullPathShare) => {
    const shareUrl = new URL('https://t.me/share/url');
    shareUrl.searchParams.set('url', url);
    shareUrl.searchParams.set('text', text);
    open(shareUrl.toString());
  };

  const shareOnFarcaster = (text: string, embeds: string[] = [fullPathShare]) => {
    const url = new URL('https://warpcast.com/~/compose');
    url.searchParams.set('text', text);
    embeds.forEach((embed) => url.searchParams.append('embeds[]', embed));
    open(url.toString());
  };

  return {
    shareOnX,
    shareOnTelegram,
    shareOnFarcaster,
  };
}
