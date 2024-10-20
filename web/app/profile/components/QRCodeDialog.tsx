import { AuthClientError } from '@farcaster/auth-client';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Card,
} from '@nextui-org/react';
import { QRCode } from '@farcaster/auth-kit';

export function QRCodeDialog({
  open,
  onClose,
  url,
  isError,
  error,
}: {
  open: boolean;
  onClose: () => void;
  url: string;
  isError: boolean;
  error?: AuthClientError;
}) {
  return (
    <Modal isOpen={open} onClose={onClose} aria-labelledby="Sign in with Farcaster">
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1">
            {isError ? 'Error' : 'Sign in with Farcaster'}
          </ModalHeader>
          <ModalBody>
            {isError ? (
              <p>{error?.message ?? 'Unknown error, please try again.'}</p>
            ) : (
              <>
                <p>To sign in with Farcaster, scan the code below with your phone&apos;s camera.</p>
                <div className="my-4 flex justify-center">
                  <QRCode uri={url} size={200} />
                </div>
              </>
            )}
          </ModalBody>
          <ModalFooter className="flex justify-center">
            {!isError && (
              <Button
                color="primary"
                variant="light"
                onPress={() => {
                  window.open(url, '_blank');
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width={12} height={18} fill="none">
                  <title>Sign in With Farcaster QR Code</title>
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M0 3a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Zm4-1.5v.75c0 .414.336.75.75.75h2.5A.75.75 0 0 0 8 2.25V1.5h1A1.5 1.5 0 0 1 10.5 3v12A1.5 1.5 0 0 1 9 16.5H3A1.5 1.5 0 0 1 1.5 15V3A1.5 1.5 0 0 1 3 1.5h1Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="ml-2">I&apos;m using my phone →</span>
              </Button>
            )}
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}
