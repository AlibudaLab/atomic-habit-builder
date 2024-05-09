'use client';

import { useState } from 'react';

import { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import useUserChallenges from '@/hooks/useUserChallenges';
import Onboard from './components/Onboard';
import Dashboard from './components/Dashboard';


const nouns = require('@/imgs/nouns.png') as string;

export default function DashboardPage() {

  const address = '0xBAbe69e7F2C7A9f0369Ae934865d0097B73543Fc'

  const { data: challenges } = useUserChallenges(address);


  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Toaster />
      <button type="button" onClick={() => {
        // todo: go to home
      }}>
        <Image src={nouns} width="100" height="100" alt="Nouns Logo" className="mb-10" />
      </button>

      <div className="font-title container mb-10 w-full text-center text-4xl">
        {' '}
        Alibuda Habit Builder{' '}
      </div>

      
      <div className="flex flex-col items-center justify-center">
        {!address ? (
          <Onboard />
        ) : (
          <Dashboard challenges={challenges}/>
        )}
      </div>
  
    </main>
  );
}
