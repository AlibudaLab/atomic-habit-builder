'use client';

import { Snippet } from '@nextui-org/snippet';
import { logEventSimple } from '@/utils/gtag';
import useInviteLink from '@/hooks/useInviteLink';

type InviteLinkProps = {
  accessCode: string | undefined;
  challengeId: number;
  className?: string;
  text?: string;
};

export default function InviteLink({ accessCode, challengeId, className, text }: InviteLinkProps) {
  const { getInviteLink } = useInviteLink(challengeId, accessCode);

  return (
    <Snippet
      className={`mb-4 rounded-xl p-2 px-4 ${className ?? ''}`}
      size="sm"
      hideSymbol
      color="default"
      codeString={getInviteLink()}
      onClick={() => {
        logEventSimple({ eventName: 'click_copy_invite', category: 'others' });
      }}
    >
      <span> {text ? text : 'Copy Invite Link'} </span>
    </Snippet>
  );
}
