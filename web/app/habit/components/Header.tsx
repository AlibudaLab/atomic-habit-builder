'use client';

import { Toaster } from 'react-hot-toast';
import Image from 'next/image';

const nouns = require('@/imgs/nouns.png') as string;

export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-8">
      <Toaster />
      <button
        type="button"
        onClick={() => {
          // todo: go back home
          console.log('img clicked');
        }}
      >
        <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />
      </button>

      <div className="font-title container mb-10 w-full text-center text-3xl">
        {' '}
        Alibuda Habit Builder{' '}
      </div>
    </main>
  );
}
