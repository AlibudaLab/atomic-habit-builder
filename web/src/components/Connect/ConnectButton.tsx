import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { RegisterButton } from './RegisterButton';

/**
 * Open a modal that allow both register & login
 */
export function ConnectButton({
  cta,
  className,
  primary,
}: {
  cta?: string;
  className?: string;
  primary?: boolean;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { login, isPending: connecting, signedInBefore, register } = usePasskeyConnection();

  return (
    <>
      <Button
        type="button"
        className={`min-h-12 px-6 py-3 ${className ? className : ''}`}
        onClick={onOpen}
        isLoading={connecting}
        color={primary ? 'primary' : 'default'}
      >
        {cta ? cta : 'Connect'}
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="m-2 flex flex-col gap-1"> Connect with Passkey </ModalHeader>
          <ModalBody className="justify-center">
            <div className="mx-2 text-sm">We need to verify your identity to continue!</div>

            <div className="flex flex-col items-center justify-center">
              <Button
                type="button"
                className="m-4 mt-8 w-48 p-6 font-londrina"
                color="primary"
                isLoading={connecting}
                onClick={login}
              >
                {'Sign in'}
              </Button>

              {/* always put register as secondary */}
              <RegisterButton />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
