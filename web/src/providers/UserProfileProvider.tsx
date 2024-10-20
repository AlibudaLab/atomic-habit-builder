import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';
import { usePasskeyAccount } from './PasskeyProvider';

type FarcasterProfile = {
  username: string;
  fid: string;
  displayName: string;
  pfpUrl: string;
};

type UserProfileContextType = {
  loading: boolean;
  farcasterProfile: FarcasterProfile | null;
  error: unknown | null;
  refetch: () => void;
};

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export function UserProfileProvider({ children }: { children: ReactNode }) {
  const { address } = usePasskeyAccount();
  const [loading, setLoading] = useState(false);
  const [farcasterProfile, setFarcasterProfile] = useState<FarcasterProfile | null>(null);
  const [error, setError] = useState<unknown | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!address) {
      setLoading(false);
      setFarcasterProfile(null);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/user?address=${address}`, { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to fetch user profile');
      const result = await response.json();

      if (result.farcaster) {
        setFarcasterProfile(result.farcaster);
      } else {
        setFarcasterProfile(null);
      }
    } catch (_error) {
      setError(_error);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const refetch = useCallback(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const value = useMemo(() => {
    return { loading, farcasterProfile, error, refetch };
  }, [loading, farcasterProfile, error, refetch]);

  return <UserProfileContext.Provider value={value}>{children}</UserProfileContext.Provider>;
}

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (context === undefined) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
