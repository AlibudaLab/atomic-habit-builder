import { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';

type ManualCheckInButtonProps = {
  isLoading: boolean;
  challengeType: string;
  onConfirm: () => void;
};

function ManualCheckInButton({ isLoading, challengeType, onConfirm }: ManualCheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleConfirm = useCallback(() => {
    onConfirm();
  }, [onConfirm]);

  return (
    <>
      <Button
        type="button"
        color="primary"
        className="mt-4 min-h-12 w-full"
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
            <Button
              color="primary"
              isLoading={isLoading}
              onClick={handleConfirm}
              isDisabled={isLoading}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ManualCheckInButton;
