import { execHaloCmdWeb } from '@arx-research/libhalo/api/web';
import moment from 'moment';

const getCheckinMessage = (address: `0x${string}`): string => {
  return `checking in! user: ${address}, time: ${moment().unix()}`;
};

const arxSignMessage = async (message: string): Promise<unknown> => {
  const command = {
    name: 'sign',
    message,
    keyNo: 1,
    legacySignCommand: false,
    format: 'text',
  };

  return execHaloCmdWeb(command);
};

export { getCheckinMessage, arxSignMessage };
