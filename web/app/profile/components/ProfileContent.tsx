 
'use client';

import { useAccount, useBalance } from 'wagmi';
import * as testToken from '@/contracts/testToken';
import { formatUnits } from 'viem';
import Onboard from 'app/habit/components/Onboard';
import { getSlicedAddress,getExplorerLink } from '@/utils/address';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

import usdcIcon from '@/imgs/coins/usdc.png'
import Image from 'next/image';
import Link from 'next/link';
import { base } from 'viem/chains';
import useUserChallenges from '@/hooks/useUserChallenges';

export default function ProfileContent() {
  const { address, chainId } = useAccount();

  const { data: tokenBalance } = useBalance({
    address,
    token: testToken.address,
    query: {
      enabled: !!address,
    },
  });

  const {data: challenges} = useUserChallenges(address)
  
  // assume all in USDC
  const totalStaked = challenges
    .reduce((acc, challenge) => {
      if (challenge.endTimestamp > (Date.now() / 1000)) return acc + challenge.stake
      return acc + challenge.claimable
    }, BigInt(0))

  return (
    <div className="flex h-screen w-full flex-col items-center justify-start">
      {address === undefined ? (
        <Onboard />
      ) : (
        <div className='w-full'>
          <p className="my-4 font-londrina text-xl font-bold"> User Profile </p>

          <div className="w-full p-4 rounded-lg bg-slate-100 shadow-sm">
            <div className='text-xs text-gray-500'> Account </div>
            <div className="flex w-full items-center justify-start no-underline">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm"> {getSlicedAddress(address, 6)} </p>
              </div>
              <div>
                <Link href={getExplorerLink(address, chainId ?? base.id)} target='_blank'>
                <ExternalLinkIcon/>
                </Link>
              </div>
            </div>
          </div>

          <div className="w-full p-4 rounded-lg bg-slate-100 shadow-sm mt-4">
            <div className='text-xs text-gray-500'> Wallet Balance </div>
            <div className="flex w-full items-center justify-start no-underline">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm"> {tokenBalance
                ? formatUnits(tokenBalance?.value, tokenBalance?.decimals)
                : 'pending'}{' '} </p>
              </div>
              <div>
                <Image
                  src={usdcIcon}
                  alt="USDC"
                  width={24}
                  height={24}
                  />
              </div>
            </div>
          </div>

          <div className="w-full p-4 rounded-lg bg-slate-100 shadow-sm mt-4">
            <div className='text-xs text-gray-500'> Total Staked </div>
            <div className="flex w-full items-center justify-start no-underline">
              <div className="flex w-full items-center justify-between">
                <p className="text-sm"> {totalStaked
                ? formatUnits(totalStaked, 6)
                : 'pending'}{' '} </p>
              </div>
              <div>
                <Image
                  src={usdcIcon}
                  alt="USDC"
                  width={24}
                  height={24}
                  />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
