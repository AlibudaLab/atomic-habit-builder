'use client';

import useUserChallenges from '@/hooks/useUserChallenges';
import Image from 'next/image';
import { SetStateAction,  } from 'react';
import { useAccount, useConnect } from 'wagmi';

const img = require('../../../src/imgs/step1.png') as string;

export default function Step1Join({setSteps}: {setSteps: React.Dispatch<SetStateAction<number>>}) {

  const { address } = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  const { data } = useUserChallenges(address)

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex justify-start w-full items-center gap-6">
        <Image
          src={img}
          width='50'
          alt="Step 2 Image"
          className="mb-3 object-cover"
        />
        <p className="text-lg font-bold mr-auto">
        Join up with World ID or Base Smart Wallet
        </p>
      </div>

      <button
        type="button"
        className="rounded-lg bg-yellow mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => connect({ connector })}
      >
        Connect
      </button>
    </div>
  );
}
