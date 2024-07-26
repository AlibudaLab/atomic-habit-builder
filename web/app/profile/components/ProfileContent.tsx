/* eslint-disable */
'use client';

import { useRouter } from 'next/navigation';
import { useAccount, useBalance } from 'wagmi';
import * as testToken from '@/contracts/testToken';

export default function ProfileContent() {
  const { push } = useRouter();
  const { address } = useAccount();

  const { data: tokenBalance } = useBalance({
    address,
    token: testToken.address,
    query: {
      enabled: !!address,
    },
  });

  return (
    
    <div className="flex h-screen w-full flex-col items-center justify-start">
      <p className="my-4 font-londrina text-xl font-bold"> User Profile </p>


      {/* address */}
      <div className="flex w-full items-center justify-between">
        {/* </div> */}
        

      </div>
    </div>
  );
}
