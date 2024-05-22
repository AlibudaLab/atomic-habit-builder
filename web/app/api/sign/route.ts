import { NextRequest, NextResponse } from 'next/server';
import { privateKeyToAccount } from 'viem/accounts';
import { secp256k1 } from '@noble/curves/secp256k1';
import { domainSeparator, hashTypedData, hexToNumber } from 'viem';

import { baseSepolia } from 'viem/chains';
import { address as trackerAddr } from '@/contracts/tracker';

const domain = {
  name: 'Alibuda Habit Builder',
  version: '1.0',
  chainId: baseSepolia.id,
  verifyingContract: trackerAddr as `0x${string}`,
};

const types = {
  checkInSigningMessage: [
    { name: 'challengeId', type: 'uint256' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'user', type: 'address' },
  ],
};

/**
 * @param req
 * @param res
 */
export async function GET(req: NextRequest): Promise<Response> {
  // Your code to handle authentication to Strava goes here
  try {
    const address = req.nextUrl.searchParams.get('address');
    if (!address) {
      return NextResponse.json({ error: 'address is required' }, { status: 400 });
    }

    // todo: make sure cannot re-submit
    const activityId = req.nextUrl.searchParams.get('activityId');
    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
    }

    const timestamp = req.nextUrl.searchParams.get('timestamp');
    if (!timestamp) {
      return NextResponse.json({ error: 'timestamp is required' }, { status: 400 });
    }

    const challengeId = req.nextUrl.searchParams.get('challengeId');
    if (!challengeId) {
      return NextResponse.json({ error: 'challengeId is required' }, { status: 400 });
    }

    const verifier = privateKeyToAccount(`0x${process.env.FAUCET_PRIVATE_KEY}`);

    const sig = await verifier.signTypedData({
      domain,
      types,
      primaryType: 'checkInSigningMessage',
      message: {
        challengeId: challengeId,
        timestamp: timestamp,
        user: address,
      },
    });

    // todo: change contract to accept bytes directly
    const { r, s } = secp256k1.Signature.fromCompact(sig.slice(2, 130));
    const v = hexToNumber(`0x${sig.slice(130)}`);

    return NextResponse.json({ v, r: r.toString(16), s: s.toString(16) }, { status: 200 });
  } catch (error) {
    console.error('Error Signing:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
