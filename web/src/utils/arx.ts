import { execHaloCmdWeb } from '@arx-research/libhalo/api/web';
import moment from 'moment';

interface ArxSignature {
  input: {
    keyNo: Number;
    digest: string;
    message: string;
  };
  signature: {
    raw: {
      r: string;
      s: string;
      v: Number;
    };
    der: string;
    ether: `0x${string}`;
  };
  publicKey: string;
  etherAddress: `0x${string}`;
}

const getCheckinMessage = (address: `0x${string}`): string => {
  return `checking in! user: ${address}, time: ${moment().unix()}`;
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

export { getCheckinMessage, arxSignMessage, type ArxSignature };
