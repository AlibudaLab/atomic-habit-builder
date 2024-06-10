'use client';

import { Button } from '@nextui-org/button';
import { useConnect } from 'wagmi';

export default function Onboard() {
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 text-center font-londrina text-xl font-bold"> Please Sign in First </p>

      <Button
        type="button"
        className="mt-4 p-6"
        color="primary"
        onClick={() => connect({ connector })}
      >
        Use Base Smart Wallet
      </Button>
    </div>
  );
}
