import { hashMessage } from 'viem';
import { execHaloCmdWeb } from '@arx-research/libhalo/api/web';

type ArxSignature = {
  input: {
    keyNo: number;
    digest: string;
    message: string;
  };
  signature: {
    raw: {
      r: string;
      s: string;
      v: number;
    };
    der: string;
    ether: `0x${string}`;
  };
  publicKey: string;
  etherAddress: `0x${string}`;
};

const getCheckinMessage = (address: `0x${string}`, timestamp: number): string => {
  return `checking in! user: ${address}, time: ${timestamp}`;
};

const getEncodedCheckinMessage = (address: `0x${string}`, timestamp: number): string => {
  return hashMessage(getCheckinMessage(address, timestamp));
};

const arxSignMessage = async (message: string): Promise<ArxSignature> => {
  const command = {
    name: 'sign',
    message,
    keyNo: 1,
    legacySignCommand: false,
    format: 'text',
  };

  return execHaloCmdWeb(command);
};

export { getCheckinMessage, arxSignMessage, getEncodedCheckinMessage, type ArxSignature };
