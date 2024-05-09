'use client';

import Image from 'next/image';
import { useConnect } from 'wagmi';

const img = require('@/imgs/step1.png') as string;

export default function Onboard() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-start gap-6">
        <Image src={img} width="50" alt="Step 2 Image" className="mb-3 object-cover" />
        <p className="mr-auto text-lg font-bold"> Join with Base Smart Wallet </p>
      </div>

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => connect({ connector })}
      >
        Connect
      </button>
    </div>
  );
}
