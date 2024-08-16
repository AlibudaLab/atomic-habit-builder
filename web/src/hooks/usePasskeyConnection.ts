'use client';

import { useConnect } from 'wagmi';

export default function usePasskeyConnection() {
  const { connectors, connect, isPending } = useConnect();

  return {
    register: () => connect({ connector: connectors[0] }),
    login: () => connect({ connector: connectors[1] }),
    isPending,
  };
}
