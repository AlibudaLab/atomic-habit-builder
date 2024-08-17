'use client';

import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { Button } from '@nextui-org/button';
import { useConnect } from 'wagmi';

export default function Onboard() {
  const { login, register, isPending } = usePasskeyConnection();

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 text-center font-londrina text-xl font-bold"> Please Sign in First </p>

      <div className="flex gap-4">
        <Button
          type="button"
          className="mt-4 p-6"
          color="primary"
          isLoading={isPending}
          onClick={login}
        >
          Login
        </Button>

        <Button
          type="button"
          className="mt-4 p-6"
          color="primary"
          isLoading={isPending}
          onClick={register}
        >
          Register
        </Button>
      </div>
    </div>
  );
}
