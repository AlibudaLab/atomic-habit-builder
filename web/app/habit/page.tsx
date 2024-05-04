'use client';


import { useState } from 'react';

import Step1 from './components/step1';
import Step2DepositAndStake from './components/step2stake';
import Step3CheckIn from './components/step3checkin';
import LoadingCard from './components/LoadingCard';
import Image from 'next/image';

const nouns = require('../../src/imgs/nouns.png') as string;

export default function HabitPage() {

  const [steps, setSteps] = useState(1)

  return (
    <main className="container mx-auto flex flex-col px-8 py-16 items-center">
      <Image src={nouns} width='100' height='100' alt="Nouns Logo" className="mb-10" />

      <div className="container mb-10 w-full text-center text-4xl font-title"> Alibuda Habit Builder </div>

      <div className='text-xl px-6 pb-10 font-title text-center'>
      Happy Builder; Habit Builder!
      </div>
      
      {(steps === 1) && <Step1 setSteps={setSteps} />}
      {(steps === 2) && <Step2DepositAndStake setSteps={setSteps} />}
      {(steps === 3) && <Step3CheckIn setSteps={setSteps} />}


      {/* just for previewing */}
      {(steps === 10) && <LoadingCard text="Message signed! The transaction is processing..." />}
      
    </main>
  );
}
