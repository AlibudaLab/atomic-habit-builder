'use client';

import { SubTitle } from '@/components/SubTitle/SubTitle';
import { randomChoice } from '@/utils/content';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function NewUser() {
  const { push } = useRouter();

  const content = useMemo(() => {
    return randomChoice([
      `No habits? No glory. Pick a challenge or create your own – your wallet's waiting.`,
      'Your USDC is getting bored. Create a habit or join a challenge – put it to work!',
      `Idle hands (and USDC) are the devil's playground. Start a habit or join the action!`,
      `No habits, no bragging rights. Start your own or join the fray – your USDC is itching to play.`,
      `Empty habit list = missed opportunities. Craft your challenge or join one – let's turn that USDC into motivation fuel.`,
    ]);
  }, []);

  return (
    <main className="container mx-4 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <SubTitle text="Welcome to Atomic" />

        <p className="mx-4 pt-8 font-nunito text-sm">{content}</p>

        {/* two buttons  */}
        <div className="flex w-full gap-2 pt-8">
          <Button className="min-h-12 w-1/2 no-underline" onClick={() => push('/habit/create')}>
            <div className="my-4 rounded-lg p-4">Create</div>
          </Button>
          <Button
            color="primary"
            className="min-h-12 w-1/2 no-underline"
            onClick={() => push('/habit/list')}
          >
            <div className="my-4 rounded-lg p-4">Explore</div>
          </Button>
        </div>
      </div>
    </main>
  );
}
