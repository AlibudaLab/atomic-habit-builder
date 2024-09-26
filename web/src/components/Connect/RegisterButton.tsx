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
import { useReferralCode } from '@/components/ReferralCodeHandler';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Always prompt user to register: warning and
 */
export function RegisterButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [referralCode, setReferralCode] = useState('');
  const [isValidReferralCode, setIsValidReferralCode] = useState<boolean | null>(null);
  const { register, isPending: connecting } = usePasskeyConnection();
  const { referralCode: storedReferralCode } = useReferralCode();

  useEffect(() => {
    if (storedReferralCode) {
      setReferralCode(storedReferralCode);
      checkReferralCode(storedReferralCode);
    }
  }, [storedReferralCode]);

  const checkReferralCode = async (code: string) => {
    if (!code) {
      setIsValidReferralCode(null);
      return;
    }

    try {
      const response = await fetch(`/api/user/referral/exist?code=${code}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setIsValidReferralCode(data.exist);
    } catch (error) {
      console.error('Error checking referral code:', error);
      setIsValidReferralCode(false);
    }
  };

  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCode = e.target.value;
    setReferralCode(newCode);
    checkReferralCode(newCode);
  };

  const handleReferral = async (newAddress: string) => {
    try {
      await fetch('/api/user/referral/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteeAddress: newAddress, referralCode }),
      });
    } catch (error) {
      console.error('Error updating referral info:', error);
    }
  };

  const handleRegister = async () => {
    const newAddress = await register();
    if (newAddress) {
      void handleReferral(newAddress);
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

            <div className="relative">
              <Input
                label="Referral Code (optional)"
                value={referralCode}
                onChange={handleReferralCodeChange}
                className="mt-4"
                endContent={
                  referralCode &&
                  (isValidReferralCode ? (
                    <CheckCircle className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-green-500" />
                  ) : (
                    <XCircle className="absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 text-red-500" />
                  ))
                }
              />
            </div>

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
