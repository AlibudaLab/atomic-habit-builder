'use client';

import Image from 'next/image';
import { SetStateAction } from 'react';
import { useAccount, useBalance } from 'wagmi';

export default function Step2DepositAndStake({setSteps}: {setSteps: React.Dispatch<SetStateAction<number>>}) {

  const {address} = useAccount()

  const balance = useBalance({address})

  const hasEnoughBalance = false

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex justify-start w-full items-center gap-6">
        <Image
          src="/../../src/imgs/step2.png"
          width={25}
          height={25}
          alt="Step 2 Image"
          className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
        />
        <p className="text-lg text-gray-700 mr-auto">
        Stake and join habit challenge
        </p>
      </div>

      {hasEnoughBalance ?
      <button
      type="button"
      className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
      onClick={() => {
        console.log('Ryan please do stake')
      }}
    > Stake </button> 
    : <button
        type="button"
        className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => {
          console.log('Ryan please onramp')
        }}
      >
        Onramp
      </button>}
    </div>
  );
}
