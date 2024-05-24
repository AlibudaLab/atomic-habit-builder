'use client';

import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import GetSingleTrait from '@/components/Nouns/GetSingleTrait';

export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-2">
      <Toaster />
      <Link href="/habit" className="p-2">
        <button type="button" aria-label="Nouns Logo">
          <GetSingleTrait
            properties={{ name: 'Nouns Logo', glasses: -2, width: 100, height: 40 }}
          />
        </button>
      </Link>

      <div className="text-primary container mb-8 w-full text-center text-2xl font-bold">
        Alibuda Habit Builder{' '}
      </div>
    </main>
  );
}
