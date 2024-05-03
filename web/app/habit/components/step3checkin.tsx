'use client';

import Image from 'next/image';
import { SetStateAction,  } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { arxSignMessage, getCheckinMessage } from '@/utils/arx';
import toast from 'react-hot-toast';

const img = require('../../../src/imgs/step3.png') as string;
const map = require('../../../src/imgs/map.png') as string;

export default function Step3CheckIn({setSteps}: {setSteps: React.Dispatch<SetStateAction<number>>}) {

  const {address} = useAccount();
  const { connectors, connect } = useConnect();
  const connector = connectors[0];

  const onCheckInButtonClick = async () =>{
    let nfcPendingToastId = null;
    try{
      if(!address){
        toast.error('Please connect your wallet first')
        return
      }
      
      nfcPendingToastId = toast.loading('Sensing NFC...')
      const checkInMessage = getCheckinMessage(address);
      const arxSignature = await arxSignMessage(checkInMessage)
      toast.dismiss()
      toast.loading('Check in successful!! 🥳🥳🥳 Sending transaction')
      // todo: send transaction
    }catch(err){
      console.error(err)
      toast.error('Please try to tap the NFC again')
    }finally{
      if(nfcPendingToastId){
        toast.dismiss(nfcPendingToastId)
      }
    }
  }

  return (
    <div className='flex flex-col items-center justify-center'>
      {/* Img and Description */}
      <div className="col-span-3 flex justify-start w-full items-center gap-6">
        <Image
          src={img}
          width='50'
          alt="Step 2 Image"
          className="mb-3 rounded-full object-cover "
        />
        <p className="text-lg text-gray-700 mr-auto">
        Check in every day
        </p>
      </div>

      <div className='font-xs text-center pt-4'>
      Scan the NFC at the pinged spot!
      </div>
      <Image
          src={map}
          width='300'
          alt="Map"
          className="mb-3 object-cover "
        />

     
      <button
      type="button"
      className="rounded-lg bg-yellow-500 mt-4 px-6 py-3 font-bold text-white hover:bg-yellow-600"
      onClick={onCheckInButtonClick}
    > Tap Here and Tap NFC </button> 
    
    </div>
  );
}
