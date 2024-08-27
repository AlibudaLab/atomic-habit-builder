import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { Button } from '@nextui-org/react';
import { RegisterButton } from './RegisterButton';

/**
 * Open a modal that allow both register & login
 */
export function SignInAndRegister({
  cta,
  className,
  primary,
}: {
  cta?: string;
  className?: string;
  primary?: boolean;
}) {
  const { login, isPending: connecting } = usePasskeyConnection();

  return (
    <div className="flex flex-col items-center justify-center">
      <Button
        type="button"
        className="m-4 mt-8 w-48 p-6 font-londrina"
        color="primary"
        isLoading={connecting}
        onClick={login}
      >
        Sign in
      </Button>

      {/* always put register as secondary */}
      <RegisterButton />
    </div>
  );
}
