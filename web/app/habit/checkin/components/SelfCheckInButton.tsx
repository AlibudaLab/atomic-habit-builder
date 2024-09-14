import React, { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';

interface SelfCheckInButtonProps {
  isDisabled: boolean;
  challengeType: string;
  setCheckedIn: (checkedIn: boolean) => void;
}

const SelfCheckInButton: React.FC<SelfCheckInButtonProps> = ({
  setCheckedIn,
  isDisabled,
  challengeType,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [duration, setDuration] = useState('');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setDuration('');
  };

  const handleConfirm = useCallback(() => {
    setCheckedIn(true);
    setIsOpen(false);
  }, [setCheckedIn, setIsOpen]);

  return (
    <>
      <Button
        type="button"
        color="default"
        className="mt-2 min-h-12 w-3/4 max-w-56"
        onClick={handleOpen}
        isDisabled={isDisabled}
      >
        Log activity
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Self Check-In Confirmation</ModalHeader>
          <ModalBody>
            <div className="m-4 flex flex-col items-center gap-4">
              <p>Are you sure you finished your {challengeType} today?</p>
              <Input
                label="Duration (minutes)"
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Enter duration in minutes"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleConfirm}>
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelfCheckInButton;
