'use client';

import { Toaster } from 'react-hot-toast';
export default function Header() {
  return (
    <main className="container mx-auto flex flex-col items-center pt-2">
      <Toaster />

      <div className="container w-full pb-6 text-center font-londrina text-3xl font-bold text-primary">
        Progress{' '}
      </div>
    </main>
  );
}
