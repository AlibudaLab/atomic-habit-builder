'use client';

import { useEffect, useState } from 'react';
import { Snippet } from '@nextui-org/snippet';
import { logEventSimple } from '@/utils/gtag';

type InviteLinkProps = {
  accessCode: string | undefined;
  challengeId: number;
};

export default function InviteLink({ accessCode, challengeId }: InviteLinkProps) {
  const [origin, setOrigin] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin);
    }
  }, []);

  const link = origin + `/habit/stake/${challengeId}${accessCode ? `?code=${accessCode}` : ''}`;
  return (
    <Snippet
      className="mb-4 rounded-xl p-2 px-4"
      size="sm"
      hideSymbol
      color="default"
      codeString={link}
      onClick={() => {
        logEventSimple({ eventName: 'click_copy_invite', category: 'others' });
      }}
    >
      <span> Copy Invite Link </span>
    </Snippet>
  );
}
