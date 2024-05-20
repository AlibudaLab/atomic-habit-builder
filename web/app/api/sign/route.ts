import { NextRequest, NextResponse } from 'next/server';
import { privateKeyToAccount } from 'viem/accounts';
import { secp256k1 } from '@noble/curves/secp256k1';
import { hexToNumber } from 'viem';

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
    const activityId = req.nextUrl.searchParams.get('activityId');
    if (!activityId) {
      return NextResponse.json({ error: 'activityId is required' }, { status: 400 });
    }

    const account = privateKeyToAccount(`0x${process.env.FAUCET_PRIVATE_KEY}`);
    const msg = await account.signMessage({
      message: `checking in! user: ${address}, time: ${activityId}`,
    });

    console.log('msg', msg);

    const { r, s } = secp256k1.Signature.fromCompact(msg.slice(2, 130));
    const v = hexToNumber(`0x${msg.slice(130)}`);

    return NextResponse.json({ v, r: r.toString(16), s: s.toString(16) }, { status: 200 });
  } catch (error) {
    console.error('Error getting Strava AuthToken:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
