'use client';

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
import { useStoredReferralCode } from '@/components/ReferralCodeHandler';

/**
 * Always prompt user to register: warning and
 */
export function RegisterButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [referralCode, setReferralCode] = useState('');
  const { register, isPending: connecting } = usePasskeyConnection();
  const { referralCode: storedReferralCode, clearReferralCode } = useStoredReferralCode();

  useEffect(() => {
    if (storedReferralCode) {
      setReferralCode(storedReferralCode);
    }
  }, [storedReferralCode]);

  const handleReferral = async (newAddress: string) => {
    console.log(
      'handleReferral, new address created with referral code!',
      newAddress,
      referralCode,
    );
    try {
      await fetch('/api/user/referral/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteeAddress: newAddress, referralCode }),
      });
      // Clear the referral code after successful registration
      clearReferralCode();
    } catch (error) {
      console.error('Error updating referral:', error);
    }
  };

  const handleRegister = async () => {
    const newAddress = await register();
    if (newAddress) {
      handleReferral(newAddress);
    }
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
