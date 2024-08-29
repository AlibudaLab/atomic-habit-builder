import { numberToHex } from 'viem';
import { Challenge } from './types';
import { MAX_BPS } from './constants';

export function convertBytesToNumber(bytes: string): number {
  const hex = bytes.startsWith('0x') ? bytes.slice(2) : bytes;
  const paddedHex = hex.padStart(8, '0');
  const reversedHex = paddedHex.match(/.{2}/g)?.reverse().join('') ?? '';
  return parseInt(reversedHex, 16);
}

export function convertNumberToBytes(num: number): string {
  const hex = numberToHex(num, { size: 4 });
  const reversed = hex.slice(2).match(/.{2}/g)?.reverse().join('') ?? '';
  return '0x' + reversed;
}

export function transformChallenge(challenge: Challenge) {
  return {
    ...challenge,
    id: convertBytesToNumber(challenge.id).toString(),
    joinedUsers: challenge.joinedUsers.map((user) => user.user.id),
  };
}

export function calculateWinningStakePerUser(
  totalUsers: bigint,
  succeedUsers: bigint,
  stakePerUser: bigint,
  donationBPS: bigint,
  status: string,
) {
  if (status !== '2' || succeedUsers.toString() === '0') return '0';

  const totalStake = totalUsers * stakePerUser;
  const donation = ((totalUsers - succeedUsers) * stakePerUser * donationBPS) / BigInt(MAX_BPS);

  return ((totalStake - donation) / succeedUsers).toString();
}
