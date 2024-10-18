import { useCallback, useState, useEffect } from 'react';
import { StatusAPIResponse, AuthClientError } from '@farcaster/auth-client';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from '@nextui-org/react';
import { QRCodeDialog } from './QRCodeDialog';
import { useSignIn, UseSignInArgs } from '@farcaster/auth-kit';
import { isMobile } from './utils/mobile';
import { useUserProfile } from '@/providers/UserProfileProvider';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';

type SignInButtonProps = UseSignInArgs & {
  onSignOut?: () => void;
};

export function SignInButton({ onSignOut, ...signInArgs }: SignInButtonProps) {
  const { address } = usePasskeyAccount();
  const { farcasterProfile, loading, refetch } = useUserProfile();
  const [showDialog, setShowDialog] = useState(false);

  const { onSuccess, onStatusResponse, onError } = signInArgs;

  const onStatusCallback = useCallback(
    (res: StatusAPIResponse) => {
      onStatusResponse?.(res);
    },
    [onStatusResponse],
  );

  const onErrorCallback = useCallback(
    (error?: AuthClientError) => {
      onError?.(error);
    },
    [onError],
  );

  const handleSignInSuccess = useCallback(
    async (res: StatusAPIResponse) => {
      if (!address) return;

      try {
        await fetch('/api/user/farcaster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
            username: res.username,
            fid: res.fid,
            displayName: res.displayName,
            pfpUrl: res.pfpUrl,
          }),
        });
        refetch(); // Refresh the user profile data
      } catch (_error) {
        console.error('Error storing Farcaster profile:', _error);
      }
    },
    [address, refetch],
  );

  const signInState = useSignIn({
    ...signInArgs,
    onSuccess: useCallback(
      async (res: StatusAPIResponse) => {
        onSuccess?.(res);
        await handleSignInSuccess(res);
      },
      [onSuccess, handleSignInSuccess],
    ),
    onStatusResponse: onStatusCallback,
    onError: onErrorCallback,
  });

  const {
    signIn,
    signOut,
    connect,
    reconnect,
    // isSuccess,
    isError,
    error,
    channelToken,
    url,
    // data,
    // validSignature,
  } = signInState;

  const handleSignOut = useCallback(async () => {
    signOut();
    setShowDialog(false); // Add this line
    onSignOut?.();
    if (address) {
      try {
        await fetch('/api/user/farcaster', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ address }),
        });
        refetch(); // Refresh the user profile data
      } catch (_error) {
        console.error('Error deleting Farcaster profile:', _error);
      }
    }
  }, [signOut, onSignOut, address, refetch]);

  const onClick = useCallback(() => {
    if (isError) {
      reconnect();
    }
    setShowDialog(true);
    signIn();
    if (url && isMobile()) {
      window.location.href = url;
    }
  }, [isError, reconnect, signIn, url]);

  useEffect(() => {
    if (!channelToken) connect().catch((_error) => console.error('Connection error:', _error));
  }, [channelToken, connect]);

  if (loading) {
    return <Button isLoading>Loading...</Button>;
  }

  if (!farcasterProfile) {
    return (
      <>
        <Button color="primary" onPress={onClick} isDisabled={!url} className="min-h-12 w-1/2">
          Connect Farcaster
        </Button>
        {url && (
          <QRCodeDialog
            open={showDialog && !isMobile()}
            onClose={() => setShowDialog(false)}
            url={url}
            isError={isError}
            error={error}
          />
        )}
      </>
    );
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: farcasterProfile.pfpUrl,
          }}
          className="transition-transform"
          description={`@${farcasterProfile.username}`}
          name={farcasterProfile.displayName}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="User Actions" variant="flat">
        <DropdownItem key="profile" className="h-14 gap-2">
          <p className="font-bold">Connected to</p>
          <p className="font-bold">@{farcasterProfile.username}</p>
        </DropdownItem>
        <DropdownItem key="logout" color="danger" onPress={handleSignOut}>
          Disconnect Farcaster
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
