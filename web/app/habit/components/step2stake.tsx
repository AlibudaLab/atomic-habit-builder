'use client';

import Image from 'next/image';
import { useRef, useState, SetStateAction } from 'react';
import { useAccount, useBalance } from 'wagmi';
import crypto from "crypto";
import { GateFiDisplayModeEnum, GateFiSDK, GateFiLangEnum } from "@gatefi/js-sdk";

import { redirect } from "next/navigation";

export default function Step2DepositAndStake({setSteps}: {setSteps: React.Dispatch<SetStateAction<number>>}) {
  const overlayInstanceSDK = useRef<GateFiSDK | null>(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const { address } = useAccount()

  const balance = useBalance({address})

  const hasEnoughBalance = (balance.data ?? { value: 0 }).value > 0.01;

  console.log(`address: `, address, `balance: `, balance.data, `hasEnoughBalance: `, hasEnoughBalance)

  const handleOnClick = () => {
    if (overlayInstanceSDK.current) {
      if (isOverlayVisible) {
        console.log('is visible')
        overlayInstanceSDK.current.hide();
        setIsOverlayVisible(false);
      } else {
        console.log('is not visible')
        overlayInstanceSDK.current.show();
        setIsOverlayVisible(true);
      }
    } else {
      const randomString = crypto.randomBytes(32).toString("hex");
      overlayInstanceSDK.current = new GateFiSDK({
        merchantId: `${process.env.NEXT_PUBLIC_UNLIMIT_MERCHANTID}`,
        displayMode: GateFiDisplayModeEnum.Overlay,
        nodeSelector: "#overlay-button",
        lang: GateFiLangEnum.en_US,
        isSandbox: true,
        successUrl:"https://www.crypto.unlimit.com/",
        walletAddress: address,
        externalId: randomString,
        defaultFiat: {
          currency: "USD",
          amount: "20",
        },
        defaultCrypto: {
          currency: "ETH",
        },
      });
    }
    overlayInstanceSDK.current?.show();
    setIsOverlayVisible(true);
  };

  if (!address) {
    redirect('/')
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex justify-start w-full items-center gap-6">
        <Image
          src="/../../src/imgs/step2.png"
          width={25}
          height={25}
          alt="Step 2 Image"
          className="mb-3 h-32 w-32 rounded-full object-cover shadow-lg"
        />
        <p className="text-lg text-gray-700 mr-auto">
        Stake and join habit challenge
        </p>
      </div>

      {hasEnoughBalance ?
      <button
      type="button"
      className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
      onClick={() => {
        console.log('Ryan please do stake')
      }}
    > Stake </button> 
    : <button
        type="button"
        className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
        onClick={(handleOnClick)}
      >
        Onramp
      </button>
      }
      <div id="overlay-button"> </div>
    </div>
  );
}
