'use client';

import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import Link from 'next/link';

const nouns = require('@/imgs/nouns.png') as string;

export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-8">
      <Toaster />
      <Link href="/habit">
        <button
          type="button"
        >
          <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />
        </button>
      </Link>

      <div className="font-title container mb-10 w-full text-center text-3xl">
        {' '}
        Alibuda Habit Builder{' '}
      </div>
    </main>
  );
}
