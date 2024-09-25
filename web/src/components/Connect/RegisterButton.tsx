import { useState, useEffect } from 'react';
import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from '@nextui-org/react';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';

/**
 * Always prompt user to register: warning and
 */
export function RegisterButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [referralCode, setReferralCode] = useState('');
  const { register, isPending: connecting } = usePasskeyConnection();
  const { address } = usePasskeyAccount();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refCode = params.get('ref');
    if (refCode) {
      setReferralCode(refCode);
      localStorage.setItem('referralCode', refCode);
    } else {
      const storedCode = localStorage.getItem('referralCode');
      if (storedCode) {
        setReferralCode(storedCode);
      }
    }
  }, []);

  useEffect(() => {
    if (address && referralCode) {
      handleReferral(address);
    }
  }, [address, referralCode]);

  const handleReferral = async (newAddress: string) => {
    try {
      await fetch('/api/user/referral/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteeAddress: newAddress, referralCode }),
      });
    } catch (error) {
      console.error('Error updating referral:', error);
    }
  };

  const handleRegister = async () => {
    await register();
    // The address will be updated in usePasskeyAccount after successful registration
  };

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

            <Input
              label="Referral Code (optional)"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              className="mt-4"
            />

            <div className="flex flex-col items-center justify-center">
              <Button
                type="button"
                className="m-4 mt-8 w-48 p-6 font-londrina"
                color="primary"
                isLoading={connecting}
                onClick={handleRegister}
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
