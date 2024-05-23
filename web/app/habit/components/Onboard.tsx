'use client';

import { useConnect } from 'wagmi';

export default function Onboard() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pt-2 pb-4 text-lg"> Stake and commit to a new habit! </p>

      <button
        type="button"
        className="bg-primary mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={() => connect({ connector })}
      >
        Sign In
      </button>
    </div>
  );
}
