/* eslint-disable react-perf/jsx-no-new-function-as-prop */
'use client';

import React from 'react';
import moment from 'moment';
import { Input } from '@nextui-org/input';
import { ChallengeTypes } from '@/constants';
import { Select, SelectItem } from '@nextui-org/select';
import { donationDestinations } from '@/constants';
import { Address } from 'viem';

type Step2Props = {
  challengeType: ChallengeTypes;
  setChallengeType: (challengeType: ChallengeTypes) => void;
  setDonationAddr: (donationAddr: Address) => void;
};

export default function CreateStep2({
  challengeType,
  setChallengeType,
  setDonationAddr,
}: Step2Props) {
  return (
    <div className="flex max-w-[500px] flex-col items-center justify-start px-10">
      <Select label="Challenge Type" className="my-4" value={challengeType}>
        {Object.values(ChallengeTypes)
          .filter((type: ChallengeTypes) => type !== ChallengeTypes.NFC_Chip)
          .map((type: ChallengeTypes) => (
            <SelectItem key={type} onClick={() => setChallengeType(type)}>
              {type}
            </SelectItem>
          ))}
      </Select>

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
    </div>
  );
}
