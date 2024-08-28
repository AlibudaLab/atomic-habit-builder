'use client';

import React from 'react';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { donationDestinations } from '@/constants';
import { Address } from 'viem';
import { Button } from '@nextui-org/button';
import Image from 'next/image';

import usdcLogo from '@/imgs/coins/usdc.png';
import { useAccount } from 'wagmi';
import usePasskeyConnection from '@/hooks/usePasskeyConnection';
import { ConnectButton } from '@/components/Connect/ConnectButton';

type Step2Props = {
  stake: number;
  setStake: (stake: number) => void;
  setDonationAddr: (donationAddr: Address) => void;
  onClickCreate: () => void;
  isCreating: boolean;
  setStep: (step: number) => void;
};

export default function CreateStep2({
  stake,
  setStake,
  setDonationAddr,
  onClickCreate,
  isCreating,
  setStep,
}: Step2Props) {
  const { address } = useAccount();

  return (
    <div className="flex w-full flex-grow flex-col items-center justify-start px-8">
      <Input
        type="number"
        label="Stake"
        className="my-4"
        value={stake.toString()}
        onChange={(e) => setStake(Number(e.target.value))}
        placeholder="100"
        endContent={
          <div className="pointer-events-none flex items-center justify-center gap-2">
            <span className="text-small text-default-400"> USDC </span>
            <Image src={usdcLogo} alt="usdc" width={20} height={20} />
          </div>
        }
      />

      <Input
        type="text"
        label="Verifier"
        value="Strava"
        className="my-4"
        readOnly
        description="Only supports Strava now"
        isDisabled
      />

      <Input
        type="text"
        label="Extra Yield Source"
        className="my-4"
        value="None"
        readOnly
        description="Coming soon!"
        isDisabled
      />

      {/* donation */}
      <Select
        label="Donation organization"
        className="my-4"
        description="20% of forfeiture stake goes to this org."
        defaultSelectedKeys={[donationDestinations[0].address]}
      >
        {donationDestinations.map((org) => (
          <SelectItem key={org.address} onClick={() => setDonationAddr(org.address)}>
            {org.name}
          </SelectItem>
        ))}
      </Select>

      <div className="mb-4 flex w-full justify-center gap-2">
        <Button className="mt-2 min-h-12 w-1/2" color="default" onClick={() => setStep(1)}>
          Back
        </Button>
        {address ? (
          <Button
            isLoading={isCreating}
            onClick={onClickCreate}
            className="mt-2 min-h-12 w-1/2"
            color="primary"
          >
            Create
          </Button>
        ) : (
          <ConnectButton className="mt-2 w-1/2" cta="Create" primary />
        )}
      </div>
    </div>
  );
}
