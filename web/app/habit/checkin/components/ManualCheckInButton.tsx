import React, { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';

type ManualCheckInButtonProps = {
  isDisabled: boolean;
  challengeType: string;
  onConfirm: () => void;
};

function ManualCheckInButton({ isDisabled, challengeType, onConfirm }: ManualCheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleConfirm = useCallback(() => {
    onConfirm();
    setIsOpen(false);
  }, [onConfirm]);

  return (
    <>
      <Button
        type="button"
        color="primary"
        className="mt-4 min-h-12 w-3/4 max-w-56"
        onClick={handleOpen}
      >
        Submit Check-In
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Confirm Manual Check-In</ModalHeader>
          <ModalBody>
            <p>
              Are you sure you want to submit a manual check-in for this {challengeType} challenge?
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Remember, honesty keeps the challenge fair!
            </p>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={handleClose}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleConfirm} isDisabled={isDisabled}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManualCheckInButton;
