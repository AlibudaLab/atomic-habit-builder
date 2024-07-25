/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import { useEffect, useState } from 'react';
import { Snippet } from '@nextui-org/snippet';

type InviteLinkProps = {
  accessCode: string;
  showCode: boolean;
  challengeId: number;
};

export default function InviteLink({ accessCode, challengeId, showCode }: InviteLinkProps) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = origin + `/habit/stake/${challengeId}?code=${accessCode}`;
  return (
    <Snippet
      className="mb-4 rounded-xl p-2 px-4"
      size="sm"
      hideSymbol
      color="default"
      codeString={link}
    >
      <span> {showCode ? accessCode : 'Copy Invite Link'} </span>
    </Snippet>
  );
}
