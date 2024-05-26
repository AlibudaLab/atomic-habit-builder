'use client';

import Claim from '../components/claim';

import Header from '../../components/Header';

export default function ClaimPage() {
  return (
    <main className="container mx-auto flex flex-col items-center px-4 pt-16">
      <Header />

      <Claim />
    </main>
  );
}
