'use client';

import Image from 'next/image';
import Link from 'next/link';

const nouns = require('@/imgs/nouns.png') as string;
const step1 = require('@/imgs/step1.png') as string;
const step2 = require('@/imgs/step2.png') as string;
const step3 = require('@/imgs/step3.png') as string;
const step4 = require('@/imgs/step4.png') as string;

export default function HomePage() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 py-16 text-center ">
      <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />

      <div className="font-title container mb-4 w-full text-center text-4xl">
        Alibuda Habit Builder
      </div>

      <div className="font-slogan px-6 pb-10 text-2xl">
        Hi mate! Let’s build a habit and support public goods together!
      </div>

      <div className="flex w-full flex-col items-center gap-6 ">
        {/* Step 1 */}
        <div className="col-span-3 flex w-full items-center justify-start gap-6">
          <Image src={step1} width="60" alt="Step 1 Image" className="mb-3 object-cover" />
          <p className="mr-auto  text-lg font-bold">Join with World ID or Base Smart Wallet</p>
        </div>

        {/* Step 2 */}
        <div className="col-span-3 flex w-full items-center justify-start gap-6 font-bold">
          <Image src={step2} width="60" alt="Step 2 Image" className="mb-3 object-cover" />
          <p className="text-lg ">Stake and join habit challenge</p>
        </div>

        {/* Step 3 */}
        <div className="col-span-3 flex w-full items-center justify-start gap-6 font-bold">
          <Image src={step3} width="60" alt="Step 3 Image" className="mb-3 object-cover" />
          <p className="text-lg ">Check in every day</p>
        </div>

        {/* Step 4 */}
        <div className="col-span-3 flex w-full items-center justify-start gap-6 font-bold">
          <Image src={step4} width="60" alt="Step 2 Image" className="mb-3 object-cover" />
          <p className="text-lg ">Earn stake back and rewards</p>
        </div>
      </div>

      <Link href="/habit">
        <button
          type="button"
          className="bg-yellow mt-10 rounded-lg border-2 border-solid border-black px-8 py-3 text-xl font-bold text-white hover:bg-yellow-600"
        >
          Start Building
        </button>
      </Link>
    </main>
  );
}
