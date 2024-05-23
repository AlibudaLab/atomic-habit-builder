'use client';

import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';

export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-8">
      <Toaster />
      <Link href="/habit">
        <button type="button" aria-label="Nouns Logo">
          <GetSingleTrait
            properties={{ name: 'Nouns Logo', glasses: -2, width: 163, height: 62 }}
          />
        </button>
      </Link>

      <div className="font-title container mb-10 w-full text-center text-3xl text-primary">
        {' '}
        Alibuda Habit Builder{' '}
      </div>
    </main>
  );
}
