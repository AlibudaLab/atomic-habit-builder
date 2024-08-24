import { randomChoice } from '@/utils/content';
import { useMemo } from 'react';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';

export function NotConnected() {
  const content = useMemo(() => {
    return randomChoice([
      'Your financial fate is sealed here. Connect to peek.',
      "See if you are winning or contributing to others' winnings. Connect.",
      `Your wallet's journey is documented here. Connect to track it.`,
      'Your habit history is calling. Connect to answer.',
      'Wallet fatter or lighter? Connect for the truth.',
    ]);
  }, []);

  return (
    <div className="mt-12 flex flex-col items-center justify-center">
      <div className="mx-6 text-center font-nunito text-sm">{content}</div>
      <SignInAndRegister />
    </div>
  );
}
