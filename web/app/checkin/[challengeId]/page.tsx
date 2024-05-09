'use client';

import { useState } from 'react';

import Step3CheckIn from '../components/checkin';
import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { Challenge } from '@/hooks/useUserChallenges';

const nouns = require('../../../src/imgs/nouns.png') as string;

import { challenges } from '@/constants';
import { useSearchParams } from 'next/navigation';

export default function CheckInLayout() {

  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Toaster />
      <button type="button" onClick={() => {console.log('img clicked')}}>
        <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />
      </button>

      <div className="font-title container mb-10 w-full text-center text-4xl">
        {' '}
        Alibuda Habit Builder{' '}
      </div>

      <Step3CheckIn />
    </main>
  );
}
