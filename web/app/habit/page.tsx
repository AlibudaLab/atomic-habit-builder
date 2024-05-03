'use client';


import { useState } from 'react';

import Step1Join from './components/step1join';
import Step2DepositAndStake from './components/step2stake';
import Step3CheckIn from './components/step3checkin';

export default function HabitPage() {

  const [steps, setSteps] = useState(1)

  return (
    <main className="container mx-auto flex flex-col px-8 py-16">
      <div className="container mb-10 w-full text-center text-4xl font-title"> Alibuda Habit Builder </div>

      <div className='text-xl px-6 pb-10 font-title text-center'>
      Happy Builder; Habit Builder!
      </div>
      
      {(steps === 1) && <Step1Join setSteps={setSteps} />}
      {(steps === 2) && <Step2DepositAndStake setSteps={setSteps} />}
      {(steps === 3) && <Step3CheckIn setSteps={setSteps} />}
      
    </main>
  );
}
