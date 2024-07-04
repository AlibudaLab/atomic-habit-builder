/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import React from 'react';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { donationDestinations } from '@/constants';
import { Address } from 'viem';
import { Button } from '@nextui-org/button';
import Image from 'next/image';

import usdcLogo from '@/imgs/coins/usdc.png';
import { useAccount, useConnect } from 'wagmi';

type Step2Props = {
  stake: number;
  setStake: (stake: number) => void;
  setDonationAddr: (donationAddr: Address) => void;
  onClickCreate: () => void;
  isCreating: boolean;
};

export default function CreateStep2({
  stake,
  setStake,
  setDonationAddr,
  onClickCreate,
  isCreating,
}: Step2Props) {
  const { connect, connectors } = useConnect();
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
        description="Half of forfeiture stake goes to this org."
      >
        {donationDestinations.map((org) => (
          <SelectItem key={org.address} onClick={() => setDonationAddr(org.address)}>
            {org.name}
          </SelectItem>
        ))}
      </Select>

      {address ? (
        <Button
          isLoading={isCreating}
          onClick={onClickCreate}
          className="mt-2 min-h-12 w-full"
          color="primary"
        >
          Create
        </Button>
      ) : (
        <Button
          onClick={() => connect({ connector: connectors[0] })}
          className="mt-2 min-h-12 w-full"
          // color="primary"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
}
