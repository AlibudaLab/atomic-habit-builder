'use client';

import { SubTitle } from '@/components/SubTitle/SubTitle';
import { useAllChallenges } from '@/providers/ChallengesProvider';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';

export default function NewUser() {
  const { push } = useRouter();

  return (
    <main className="container mx-4 flex flex-col items-center px-4 text-center">
      <div className="flex w-full flex-col items-center justify-center">
        <SubTitle text="Welcome to Atomic" />

        <p className="mx-4 pt-8 font-nunito text-sm">
          To start your Atomic journey, you can join a challenge or create a new one.
        </p>

        {/* two buttons  */}
        <div className="flex w-full gap-2 pt-8">
          <Button className="w-1/2 no-underline" onClick={() => push('/habit/create')}>
            <div className="my-4 rounded-lg p-4">Create</div>
          </Button>
          <Button
            color="primary"
            className="w-1/2 no-underline"
            onClick={() => push('/habit/list')}
          >
            <div className="my-4 rounded-lg p-4">Explore</div>
          </Button>
        </div>
      </div>
    </main>
  );
}
