'use client';

import { useBalance, useReadContract, useChainId, useSwitchChain } from 'wagmi';
import { emergencySupportedChains, usdcAddr, usdcContractAddrs } from '@/constants';
import { erc20Abi, formatUnits, zeroAddress } from 'viem';
import { Button } from '@nextui-org/button';
import { base, arbitrum, arbitrumSepolia, baseSepolia } from 'viem/chains';
import { useMemo, useState } from 'react';
import WithdrawPopup from './SpecialWithdrawPopup';
import { SubTitle } from '@/components/SubTitle/SubTitle';
import { SignInAndRegister } from '@/components/Connect/SignInAndRegister';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import Loading from 'app/habit/components/Loading';
import { getSlicedAddress } from '@/utils/address';
import { CopyIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileContent() {
  const { address, isInitializing } = usePasskeyAccount();

  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const { data: altChainBalance } = useReadContract({
    address: usdcContractAddrs[chainId],
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: [address ?? zeroAddress],
  });

  return (
    <div className="container flex flex-col items-center">
      <div className="mx-2 w-full items-center">
        {isWithdrawModalOpen && (
          <WithdrawPopup
            onClose={() => setIsWithdrawModalOpen(false)}
            chainId={chainId}
            maxAmount={altChainBalance}
          />
        )}

        <SubTitle text="Special Withdrawal" />

        <p className="m-8 text-center font-nunito text-sm">
          You can withdraw your funds that are currently sitting in any chain, in your wallet here.
        </p>

        {isInitializing ? (
          <Loading />
        ) : address === undefined ? (
          <div className="flex flex-col items-center justify-center">
            <div className="my-4 pt-10 font-nunito text-sm">Connect to view your profile</div>
            <SignInAndRegister />
          </div>
        ) : (
          <>
            {address !== undefined && (
              <>
                <div className="my-6 w-full">
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
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="mt-6 w-full">
            <div className="flex flex-wrap gap-2">
              {emergencySupportedChains.map((supportedChain) => (
                <Button
                  key={supportedChain.id}
                  onClick={() => switchChain?.({ chainId: supportedChain.id })}
                  variant={chainId === supportedChain.id ? 'solid' : 'light'}
                  className="flex items-center gap-2"
                >
                  {chainId === supportedChain.id && (
                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                  )}
                  {supportedChain.name}
                </Button>
              ))}
            </div>
            </div>

            <div className="mt-12 w-full rounded-lg bg-slate-100 p-4 shadow-sm">
              <div className="text-xs text-gray-500"> Balance </div>

              <div className="flex items-center justify-between">
                <div className="font-nunito text-sm">
                  {altChainBalance ? formatUnits(altChainBalance, 6) : '0'}
                </div>

                <Button onClick={() => setIsWithdrawModalOpen(true)} className="p-2 text-sm">
                  Withdraw
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
