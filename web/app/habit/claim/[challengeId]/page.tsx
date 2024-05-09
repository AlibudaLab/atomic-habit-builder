'use client';

import Claim from '../components/claim';

import Header from '../../components/Header';

export default function CheckInLayout() {
  return (
    <main className="container mx-auto flex flex-col items-center px-8 pt-16">
      <Header />

      <Claim />
    </main>
  );
}
