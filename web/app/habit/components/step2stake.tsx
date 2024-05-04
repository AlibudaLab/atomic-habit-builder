'use client';

import Image from 'next/image';
import { useRef, useState, SetStateAction } from 'react';
import { useAccount, useBalance } from 'wagmi';
import crypto from 'crypto';
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from '@gatefi/js-sdk';

import { redirect } from 'next/navigation';
import { Challenge } from '@/hooks/useUserChallenges';

const img = require('../../../src/imgs/step2.png') as string;
const kangaroo = require('../../../src/imgs/kangaroo.png') as string;

import { challenges } from '@/constants';

export default function Step2DepositAndStake({
  setSteps,
  setSelectedChallenge,
  selectedChallenge
}: {
  setSteps: React.Dispatch<SetStateAction<number>>;
  setSelectedChallenge: React.Dispatch<SetStateAction<Challenge>>;
  selectedChallenge: Challenge;
}) {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);


  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedChallengeName = event.target.value;
    const challenge = challenges.find((c) => c.name === selectedChallengeName);
    if (challenge) {
      setSelectedChallenge(challenge);
    }
  };

  const { address } = useAccount();
  const balance = useBalance({ address });
  const hasEnoughBalance = (balance.data ?? { value: 0 }).value > 0.01;

  const handleOnClick = async () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        console.log('is visible');
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        console.log('is not visible');
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = crypto.randomBytes(32).toString('hex');
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: '#overlay-button',
        lang: GateFiLangEnum.en_US,
        isSandbox: true,
        successUrl: 'https://www.crypto.unlimit.com/',
        walletAddress: address,
        externalId: randomString,
        defaultFiat: {
          currency: 'USD',
          amount: '20',
        },
        defaultCrypto: {
          currency: 'ETH',
        },
      });
    }
    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
    // Get data from web/app/habit/mock/on-ramp.json
    const mockData = require('../mock/on-ramp.json');
    mockData.data.destinationWallet = address;
    // Call the bridge API with payload
    await fetch('/api/bridge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockData),
    });
  };

  if (!address) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Img and Description */}
      <div className="col-span-3 flex w-full items-center justify-start gap-6">
        <Image src={img} width="50" alt="Step 2 Image" className="mb-3 rounded-full object-cover" />
        <p className="mr-auto text-lg font-bold">Stake and join habit challenge</p>
      </div>
      <div>
        <p className="p-4 text-sm"> Choose Challenge </p>
      </div>

      {/* drop down here */}
      <div>
        {/* ... existing JSX ... */}
        <select
          style={{ borderColor: '#7E7956', border: 'solid', width: '250px', height: '45px' }}
          value={selectedChallenge.name ?? ''}
          onChange={handleOnChange}
          className="bg-light rounded-md p-2 text-center"
        >
          {challenges.map((challenge) => (
            <option key={challenge.name} value={challenge.name}>
              {challenge.name}
            </option>
          ))}
        </select>
      </div>

      {hasEnoughBalance ? (
        <button
          type="button"
          className="bg-yellow mt-4 rounded-lg border-solid px-6 py-3 font-bold"
          style={{ width: '250px', height: '45px', color: 'white' }}
          onClick={() => {
            console.log('Ryan please do stake');
          }}
        >
          Stake {selectedChallenge.stake} ETH
        </button>
      ) : (
        <button
          type="button"
          className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white hover:bg-yellow-600"
          style={{ borderColor: '#EDB830', border: 'solid', width: '250px', height: '45px' }}
          onClick={handleOnClick}
        >
          Onramp
        </button>
      )}
      <div id="overlay-button"> </div>

      {/* warn message */}
      <div className="text-md px-10 pt-10">
        if you fail to maintain the habit, 50% of the stake will be donated to designated public
        goods orgs, and 50% be distributed to other habit building winners.
      </div>

      <div className="w-full justify-start">
        <Image src={kangaroo} width="350" alt="Kangaroo" className="mb-3 object-cover" />
      </div>

      <button
        type="button"
        className="bg-yellow mt-4 rounded-lg px-6 py-3 font-bold text-white"
        onClick={() => setSteps(3)}
      >
        Next
      </button>
    </div>
  );
}
