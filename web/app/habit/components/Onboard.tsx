'use client';

import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { Button } from '@nextui-org/button';

export default function Onboard() {
  const { login, register, isPending, signedInBefore } = usePasskeyConnection();

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="pb-4 text-center font-londrina text-xl font-bold"> Please Sign in First </p>

      <Button
        type="button"
        className="m-4 mt-8 w-48 p-6 font-londrina"
        color="primary"
        isLoading={isPending}
        onClick={signedInBefore ? login : register}
      >
        {signedInBefore ? 'Sign in with Passkey' : 'Register an account'}
      </Button>

      {/* secondary login option: show as text */}
      <button type="button" onClick={signedInBefore ? register : login} className="text-sm text-gray-500 underline">
        {signedInBefore ? 'Register a new account' : 'Log in with existing passkey'}
      </button>
    </div>
  );
}
