'use client';

import { useConnect } from 'wagmi';

export default function Onboard() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 text-center font-londrina text-xl font-bold"> Please Sign in First </p>

      <button
        type="button"
        className="bg-primary mt-4 rounded-lg px-6 py-3 font-bold text-white transition-transform duration-300 hover:scale-105"
        onClick={() => connect({ connector })}
      >
        Use Base Smart Wallet
      </button>
    </div>
  );
}
