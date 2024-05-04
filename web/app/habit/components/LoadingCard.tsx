'use client';

import Image from 'next/image';
import { SetStateAction,  } from 'react';

const img = require('../../../src/imgs/nouns-loading.png') as string;

export default function LoadingCard({text}: {text: string}) {

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex flex-col justify-start w-full items-center gap-6 text-center">
        <p className="text-lg p-4">
        {text}
        </p>
      </div>
      <Image
          src={img}
          width='400'
          alt="Loading Img"
          className="mb-3 rounded-full object-cover "
        />
    </div>
  );
}
