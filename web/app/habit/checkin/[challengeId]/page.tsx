'use client';

import CheckIn from '../components/checkin';

import Header from '../../components/Header';

export default function CheckInLayout() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <CheckIn />
    </main>
  );
}
