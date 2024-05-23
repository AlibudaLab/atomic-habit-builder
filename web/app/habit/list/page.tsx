'use client';

import { ChallengeButtonList } from './components/list';
import Header from '../components/Header';

export default function ChallengeList() {
  return (
    <main className="container mx-auto flex flex-col items-center text-center px-8 pt-16">
      <Header />

      <div className="flex flex-col items-center justify-center">
        
        <p className="text-lg text-center"> Choose a challenge </p>

        {/* drop down here */}
        <div className="pt-4">
          <ChallengeButtonList/>
        </div>
      </div>
    </main>
  );
}
