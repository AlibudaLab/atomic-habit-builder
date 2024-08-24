'use client';

import { useAccount, useBalance, useDisconnect } from 'wagmi';
import { usdcAddr } from '@/constants';
import { formatUnits } from 'viem';
import { getSlicedAddress, getExplorerLink } from '@/utils/address';
import { ExternalLinkIcon } from '@radix-ui/react-icons';

import usdcIcon from '@/imgs/coins/usdc.png';
import Image from 'next/image';
import Link from 'next/link';
import { base } from 'viem/chains';
import useUserChallenges from '@/hooks/useUserChallenges';
import { CopyIcon, MinusCircleIcon, PlusCircleIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/button';
import { UserStatus } from '@/types';
import { useState } from 'react';
import DepositPopup from 'app/habit/stake/components/DepositPopup';
import WithdrawPopup from './WithdrawPopup';
import { ConnectButton } from '@/components/ConnectButton/ConnectButton';
import { SubTitle } from '@/components/SubTitle/SubTitle';

export default function ProfileContent() {
  const { address, chainId } = useAccount();

  const { disconnect } = useDisconnect();

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const { data: tokenBalance } = useBalance({
    address,
    token: usdcAddr,
    query: {
      enabled: !!address,
    },
  });

  const { data: challenges } = useUserChallenges(address);

  // assume all in USDC
  const totalStaked = challenges.reduce((acc, challenge) => {
    // include all staked amount if challenge is still ongoing
    if (challenge.endTimestamp > Date.now() / 1000) return acc + challenge.stake;

    // only get the claimable if user succeed
    if (challenge.checkedIn < challenge.targetNum) return acc;

    if (challenge.status === UserStatus.Claimed) return acc;

    return acc + challenge.succeedClaimable;
  }, BigInt(0));

  const finishedChallenges = challenges.filter(
    (challenge) =>
      challenge.endTimestamp < Date.now() / 1000 && challenge.checkedIn >= challenge.targetNum,
  );

  // todo: use a view function to replace this logic
  const usdcEarned = finishedChallenges.reduce((acc, challenge) => {
    const earned = challenge.totalStaked / challenge.totalSucceeded - challenge.stake;
    return acc + earned;
  }, BigInt(0));

  return (
    <div className="container flex flex-col items-center">
      <div className="mx-2 w-full items-center">
        {isDepositModalOpen && <DepositPopup onClose={() => setIsDepositModalOpen(false)} />}
        {isWithdrawModalOpen && (
          <WithdrawPopup
            onClose={() => setIsWithdrawModalOpen(false)}
            maxAmount={tokenBalance?.value}
          />
        )}

        <SubTitle text="User Profile" />

        {address === undefined ? (
          <div className="flex flex-col items-center justify-center">
            <div className="my-4 font-nunito text-sm">Connect to view your profile</div>
            <ConnectButton className="mt-12 w-1/2" primary />
          </div>
        ) : (
          <>
            <div className="mt-12 w-full rounded-lg bg-slate-100 p-4 shadow-sm">
              <div className="text-xs text-gray-500"> Account </div>
              <div className="flex w-full items-center justify-start no-underline">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm"> {getSlicedAddress(address, 6)} </p>
                </div>
                <div className="flex justify-center gap-2">
                  <CopyIcon
                    size={15}
                    onClick={() => {
                      void navigator.clipboard.writeText(address);
                      toast.success('Copied to clipboard');
                    }}
                  />

                  <Link href={getExplorerLink(address, chainId ?? base.id)} target="_blank">
                    <ExternalLinkIcon />
                  </Link>
                </div>
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="mt-4 w-full rounded-lg bg-slate-100 p-4 shadow-sm">
              <div className="text-xs text-gray-500"> Wallet Balance </div>
              <div className="flex w-full items-center justify-start no-underline">
                <div className="flex w-full items-center justify-between">
                  <p className="text-sm">
                    {' '}
                    {tokenBalance
                      ? formatUnits(tokenBalance?.value, tokenBalance?.decimals)
                      : 'pending'}{' '}
                  </p>
                </div>
                <div className="mr-2">
                  <Image src={usdcIcon} alt="USDC" width={26} height={26} />
                </div>
                {/* deposit */}
                <Button
                  isIconOnly
                  className="bg-slate-100"
                  onClick={() => setIsDepositModalOpen(true)}
                >
                  <PlusCircleIcon size={20} />
                </Button>

                {/* withdraw */}
                <Button
                  isIconOnly
                  className="bg-slate-100"
                  onClick={() => setIsWithdrawModalOpen(true)}
                >
                  <MinusCircleIcon size={20} />
                </Button>
              </div>
            </div>
            {/* Deposit and withdraw */}

            {/* challenge completed */}
            <div className="mt-4 w-full rounded-lg bg-slate-100 p-4 shadow-sm">
              <div className="flex w-full items-center justify-start no-underline ">
                <div className="w-full items-center text-center text-2xl">
                  <p>{finishedChallenges.length}</p>
                </div>
              </div>
              <div className="mt-2 text-center text-xs text-gray-500"> Challenge Completed </div>
            </div>

            <div className="flex">
              {/* total earned */}
              <div className="mr-2 mt-4 w-[50%] rounded-lg bg-slate-100 p-4 shadow-sm">
                <div className="flex w-full items-center justify-center no-underline">
                  <div className="items-center text-center text-2xl">
                    <p>{formatUnits(usdcEarned, 6)}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-center gap-1 text-center text-xs text-gray-500">
                  <Image src={usdcIcon} alt="USDC" width={15} height={15} />
                  <p> Earned </p>
                </div>
              </div>

              {/* total staked */}
              <div className="ml-2 mt-4 w-[50%] rounded-lg bg-slate-100 p-4 shadow-sm">
                <div className="flex w-full items-center justify-center no-underline">
                  <div className="items-center text-center text-2xl">
                    <p>{formatUnits(totalStaked, 6)}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 text-center text-xs text-gray-500">
                  <Image src={usdcIcon} alt="USDC" width={15} height={15} />
                  <p> Staked </p>
                </div>
              </div>
            </div>

            {/* disconnect button */}
            <div className="mt-12 flex items-center justify-center">
              <Button
                type="button"
                className="mt-4 min-h-12 w-1/2"
                onClick={() => {
                  void disconnect();
                }}
              >
                Log out
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
