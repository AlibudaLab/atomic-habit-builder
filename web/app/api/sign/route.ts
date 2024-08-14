import { NextRequest, NextResponse } from 'next/server';
import { privateKeyToAccount } from 'viem/accounts';
import { numberToHex } from 'viem';

import { baseSepolia } from 'viem/chains';
import { address as trackerAddr } from '@/contracts/tracker';

const domain = {
  name: 'Habit Builder',
  version: '1.0',
  chainId: baseSepolia.id,
  verifyingContract: trackerAddr,
};

const types = {
  checkInSigningMessage: [
    { name: 'challengeId', type: 'uint256' },
    { name: 'user', type: 'address' },
    { name: 'checkInData', type: 'bytes' },
  ],
};

/**
 * @param req
 * @param res
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Your code to handle authentication to Strava goes here
  const address = req.nextUrl.searchParams.get('address');
  const activityId = req.nextUrl.searchParams.get('activityId');
  const challengeId = req.nextUrl.searchParams.get('challengeId');
  try {
    if (!address) {
      return NextResponse.json({ error: 'address is required' }, { status: 400 });
    }
    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
    }

    if (!challengeId) {
      return NextResponse.json({ error: 'challengeId is required' }, { status: 400 });
    }

    console.log('Signing:', { address, activityId, challengeId });

    const verifier = privateKeyToAccount(`0x${process.env.FAUCET_PRIVATE_KEY}`);

    const sig = await verifier.signTypedData({
      domain,
      types,
      primaryType: 'checkInSigningMessage',
      message: {
        challengeId: challengeId,
        user: address,
        checkInData: numberToHex(Number(activityId)).padEnd(32, '0'),
      },
    });

    return NextResponse.json({ signature: sig }, { status: 200 });
  } catch (error) {
    console.error('Error Signing:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
