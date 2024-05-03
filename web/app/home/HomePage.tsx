/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';
import Link from 'next/link';

const nouns = require('../../src/imgs/nouns.png') as string;
const step1 = require('../../src/imgs/step1.png') as string;
const step2 = require('../../src/imgs/step2.png') as string;
const step3 = require('../../src/imgs/step3.png') as string;
const step4 = require('../../src/imgs/step4.png') as string;

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col px-8 py-16 items-center">

      <Image src={nouns} width='100' height='100' alt="Nouns Logo" className="mb-10" />

      <div className="container mb-4 w-full text-center text-4xl font-title">Alibuda Habit Builder</div>

      <div className='text-2xl px-6 pb-10 font-slogan'>
        Hi mate! Let’s build a habit and support public goods together! 
      </div>

      <div className="flex flex-col items-center gap-6 w-full ">
        {/* Step 1 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6">
          <Image
            src={step1}
            width='60'
            alt="Step 1 Image"
            className="mb-3 object-cover"
          />
          <p className="text-lg  mr-auto font-bold">
            Join with World ID or Base Smart Wallet
          </p>
        </div>

        {/* Step 2 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6 font-bold">
        <Image
            src={step2}
            width='60'
            alt="Step 2 Image"
            className="mb-3 object-cover"
          />
          <p className="text-lg ">Stake and join habit challenge</p>
        </div>

        {/* Step 3 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6 font-bold">
        <Image
            src={step3}
            width='60'
            alt="Step 3 Image"
            className="mb-3 object-cover"
          />
          <p className="text-lg ">
          Check in every day
          </p>
        </div>

        {/* Step 4 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6 font-bold">
          <Image
            src={step4}
            width='60'
            alt="Step 2 Image"
            className="mb-3 object-cover"
          />
          <p className="text-lg ">Earn stake back and rewards</p>
        </div>
      </div>

      
        <Link href="/habit"><button
        type="button"
        className="rounded-lg bg-yellow px-8 mt-10 py-3 font-bold text-xl text-white hover:bg-yellow-600 border-solid border-2 border-black"
      >
        Start Building
        </button>
      </Link>
      
    </main>
  );
}
