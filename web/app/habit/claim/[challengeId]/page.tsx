'use client';

import Claim from '../components/claim';

import Header from '../../components/Header';
import NavbarFooter from 'app/habit/components/NavbarFooter';

export default function ClaimPage() {
  return (
    <main className="container mx-auto flex flex-col items-center px-4 pt-16">
      <Header />

      <Claim />

      <NavbarFooter />
    </main>
  );
}
