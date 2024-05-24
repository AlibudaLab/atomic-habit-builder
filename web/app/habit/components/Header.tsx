'use client';

import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';

export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center pt-2">
      <Toaster />
      <Link href="/habit">
        <button type="button" aria-label="Nouns Logo">
          <GetSingleTrait properties={{ name: 'Nouns Logo', glasses: -2, width: 80, height: 32 }} />
        </button>
      </Link>

      <div className="text-primary container w-full pb-6 text-center font-londrina text-3xl font-bold">
        Alibuda Habit Builder{' '}
      </div>
    </main>
  );
}
