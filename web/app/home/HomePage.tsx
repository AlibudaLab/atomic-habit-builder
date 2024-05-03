/* eslint-disable @next/next/no-img-element */
'use client';

import Image from 'next/image';

const step1 = require('../../src/imgs/step1.png') as string;

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col px-8 py-16">
      <div className="container mb-10 w-full text-center text-4xl font-title">Alibuda Habit Builder</div>

      <div className='text-xl px-6 pb-10 font-title'>
      Hi mate! Let’s build a habit and support public goods together! 
      </div>

      <div className="flex flex-col items-center gap-6 w-full">
        {/* Step 1 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6">
          <Image
            src={step1}
            sizes='25'
            alt="Step 1 Image"
            className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <p className="text-lg text-gray-700 mr-auto">
            Join with World ID or Base Smart Wallet
          </p>
        </div>

        {/* Step 2 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6">
          <Image
            src="/path-to-your-image2.jpg"
            width={25}
            height={25}
            alt="Step 2 Image"
            className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <p className="text-lg text-gray-700">Stake and join habit challenge</p>
        </div>

        {/* Step 3 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6">
          <Image
            src="/path-to-your-image3.jpg"
            width={25}
            height={25}
            alt="Step 3 Image"
            className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <p className="text-lg text-gray-700">
          Check in every day
          </p>
        </div>

        {/* Step 4 */}
        <div className="col-span-3 flex justify-start w-full items-center gap-6">
          <Image
            src="/path-to-your-image4.jpg"
            width={25}
            height={25}
            alt="Step 4 Image"
            className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
          />
          <p className="text-lg text-gray-700">Earn stake back and rewards</p>
        </div>
      </div>

      <button
        type="button"
        className="rounded-lg bg-yellow-500 px-6 pt-10 py-3 font-bold text-white hover:bg-yellow-600"
      >
        Start Building!
      </button>
    </main>
  );
}
