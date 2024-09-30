'use client';

import React from 'react';
import { Input } from '@nextui-org/input';
import { Select, SelectItem } from '@nextui-org/select';
import { ChallengeTypes, donationDestinations } from '@/constants';
import { Address } from 'viem';
import { Button } from '@nextui-org/button';
import Image from 'next/image';
import { Switch } from '@nextui-org/switch';

import usdcLogo from '@/imgs/coins/usdc.png';
import { usePasskeyAccount } from '@/providers/PasskeyProvider';
import { ConnectButton } from '@/components/Connect/ConnectButton';

type CreateStep2Props = {
  stake: number;
  setStake: (stake: number) => void;
  setDonationAddr: (donationAddr: Address) => void;
  onClickCreate: () => void;
  isCreating: boolean;
  setStep: (step: number) => void;
  allowManualCheckIn: boolean; // Updated prop name
  setAllowManualCheckIn: (value: boolean) => void; // Updated prop name
};

export default function CreateStep2({
  stake,
  setStake,
  setDonationAddr,
  onClickCreate,
  isCreating,
  setStep,
  allowManualCheckIn,
  setAllowManualCheckIn,
}: CreateStep2Props) {
  const { address } = usePasskeyAccount();

  return (
    <div className="flex w-full flex-col items-center justify-start">
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
        label="External Data Source"
        value="Strava"
        className="my-4"
        readOnly
        description="Strava is currently the only supported external data source for activity verification."
        isDisabled
      />

      <div className="my-4 w-full items-center justify-between px-2">
        <div className="flex justify-between">
          <span className="text-sm">Allow Manual Check-In</span>
          <Switch
            size="sm"
            isSelected={allowManualCheckIn}
            onChange={(e) => setAllowManualCheckIn(e.target.checked)}
          />
        </div>

        <div className="mt-1 text-xs text-gray-400">
          {allowManualCheckIn
            ? 'Participants can manually record activities without Strava verification. This option is in addition to Strava check-ins.'
            : 'Participants must use Strava for activity verification. No manual check-ins allowed.'}
        </div>
      </div>

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
