'use client';

import Image from 'next/image';
import { SetStateAction } from 'react';

const img = require('../../../src/imgs/nouns-loading.png') as string;

export default function LoadingCard({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full flex-col items-center justify-start gap-6 text-center">
        <p className="p-4 text-lg">{text}</p>
      </div>
      <Image src={img} width="400" alt="Loading Img" className="mb-3 rounded-full object-cover " />
    </div>
  );
}
