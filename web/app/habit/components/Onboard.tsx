'use client';

import { SubTitle } from '@/components/SubTitle/SubTitle';
import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { Button } from '@nextui-org/button';

export default function Onboard() {
  const { login, register, isPending, signedInBefore, initializing } = usePasskeyConnection();

  return (
    <div className="flex flex-col items-center justify-center">
      <SubTitle text="Please Sign in First" />

      <Button
        type="button"
        className="m-4 mt-14 w-48 p-6 font-londrina"
        color="primary"
        isLoading={isPending || initializing}
        onClick={signedInBefore ? login : register}
      >
        {initializing ? '  ' : signedInBefore ? 'Sign in with Passkey' : 'Register an account'}
      </Button>

      {/* secondary login option: show as text */}
      <button
        type="button"
        onClick={signedInBefore ? register : login}
        className="text-sm text-gray-500 underline"
      >
        {signedInBefore ? 'Register a new account' : 'Log in with existing passkey'}
      </button>
    </div>
  );
}
