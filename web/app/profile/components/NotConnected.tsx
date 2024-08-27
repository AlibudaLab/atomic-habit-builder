import { randomChoice } from '@/utils/content';
import { useMemo } from 'react';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';

export function NotConnected() {
  const content = useMemo(() => {
    return randomChoice([
      'Your financial fate is sealed here. Sign in to peek.',
      "See if you are winning or contributing to others' winnings. ",
      `Your wallet's journey is documented here. Sign in to track it.`,
      'Your habit history is calling. Sign in to answer.',
      'Wallet fatter or lighter? Sign in for the truth.',
    ]);
  }, []);

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="mx-6 text-center font-nunito text-sm">{content}</div>
      <SignInAndRegister />
    </div>
  );
}
