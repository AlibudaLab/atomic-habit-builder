'use client';

import { ChevronLeftIcon } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { Toaster } from 'react-hot-toast';

export default function Header() {
  const { back } = useRouter();
  const pathName = usePathname();

  const showBackButton = useMemo(() => pathName !== '/', [pathName]);

  return (
    <main className="container mx-auto flex flex-col items-center pt-2">
      <Toaster />

      <div className="relative flex w-full items-center justify-items-center pb-6">
        <div className="absolute left-0">
          {showBackButton && (
            <button onClick={back} className="cursor-pointer pl-8 pt-2" type="button">
              <ChevronLeftIcon color="grey" size={24} />
            </button>
          )}
        </div>
        <div className="w-full text-center font-londrina text-3xl font-bold text-primary">
          Atomic
        </div>
      </div>
    </main>
  );
}
