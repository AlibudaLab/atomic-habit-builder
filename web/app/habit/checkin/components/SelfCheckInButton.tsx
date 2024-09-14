import React, { useCallback, useState } from 'react';
import { Button } from '@nextui-org/button';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal';
import { Input } from '@nextui-org/input';
import { ImCheckboxUnchecked, ImCheckboxChecked } from 'react-icons/im';

type SelfCheckInButtonProps = {
  isDisabled: boolean;
  challengeType: string;
  setCheckedIn: (checkedIn: boolean) => void;
  selfCheckedIn: boolean;
};

function SelfCheckInButton({
  selfCheckedIn,
  setCheckedIn,
  isDisabled,
  challengeType,
}: SelfCheckInButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleConfirm = useCallback(() => {
    setCheckedIn(true);
    setIsOpen(false);
  }, [setCheckedIn]);

  return (
    <>
      <Button
        type="button"
        color="default"
        className="mt-2 min-h-12 w-3/4 max-w-56"
        onClick={handleOpen}
        isDisabled={isDisabled}
        startContent={selfCheckedIn ? <ImCheckboxChecked color="green" /> : <ImCheckboxUnchecked />}
      >
        Log activity
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader>Self Check-In Confirmation</ModalHeader>
          <ModalBody>
            <div className="m-4 flex flex-col items-center gap-4">
              <p>
                🤔 Hold up! Did you really complete your {challengeType} today? Remember, honesty is
                the best policy!
              </p>
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
}

export default SelfCheckInButton;
