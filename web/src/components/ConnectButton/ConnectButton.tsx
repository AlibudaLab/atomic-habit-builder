import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useState } from 'react';

/**
 * Open a modal that allow both register & login
 */
export function ConnectButton({ className, primary }: { className?: string; primary?: boolean }) {
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
        Connect
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalHeader> Connect to Passkey </ModalHeader>
        <ModalContent>
          <ModalHeader className="m-2 flex flex-col gap-1"> Connection Required </ModalHeader>
          <ModalBody className="justify-center">
            <div className="mx-2 text-sm">
              To continue, you need to connect to a Smart Account controlled by Passkey. You can
              either sign in with an existing account or register a new one.
            </div>

            <div className="flex flex-col items-center justify-center">
              <Button
                type="button"
                className="m-4 mt-8 w-48 p-6 font-londrina"
                color="primary"
                isLoading={connecting}
                onClick={signedInBefore ? login : register}
              >
                {signedInBefore ? 'Sign in' : 'Register an account'}
              </Button>

              {/* secondary login option: show as text */}
              <button
                type="button"
                onClick={signedInBefore ? register : login}
                className="mb-4 text-sm text-gray-500 underline"
              >
                {signedInBefore ? 'Register a new account' : 'Already have a passkey? Sign in'}
              </button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
