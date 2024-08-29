import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from '@nextui-org/react';

/**
 * Always prompt user to register: warning and
 */
export function RegisterButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { register, isPending: connecting } = usePasskeyConnection();

  return (
    <>
      <button type="button" onClick={onOpen} className="mb-4 text-sm text-gray-500 underline">
        Register a new account
      </button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader className="m-2 flex flex-col gap-1"> Add a new Passkey </ModalHeader>
          <ModalBody className="justify-center">
            <div className="mx-2 text-sm">
              <p>
                Atomic requires a Passkey to control your smart wallet. It&apos;s your key to the
                playground – and your USDC. Lose it, and you&apos;re locked out for good
              </p>

              <p className="pt-2">
                Your assets, your responsibility. Ready to play gatekeeper to your own fortune?
              </p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <Button
                type="button"
                className="m-4 mt-8 w-48 p-6 font-londrina"
                color="primary"
                isLoading={connecting}
                onClick={register}
              >
                I&apos;m In!
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
