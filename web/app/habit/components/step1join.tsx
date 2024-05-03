'use client';

import Image from 'next/image';
import { SetStateAction,  } from 'react';
import { useAccount, useConnect } from 'wagmi';

export default function Step1Join({setSteps}: {setSteps: React.Dispatch<SetStateAction<number>>}) {

  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex justify-start w-full items-center gap-6">
        <Image
          src="/../../src/imgs/step2.png"
          width="25"
          height="25"
          alt="Step 2 Image"
          className="mb-3 object-cover shadow-lg"
        />
        <p className="text-lg text-gray-700 mr-auto">
        Join up with World ID or Base Smart Wallet
        </p>
      </div>

      {address ?
      <button
      type="button"
      className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
      onClick={() => setSteps(2)}
    > Next </button> 
    : <button
        type="button"
        className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => connect({ connector })}
      >
        Connect
      </button>}
    </div>
  );
}
