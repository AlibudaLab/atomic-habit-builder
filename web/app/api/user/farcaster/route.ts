import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/utils/firebaseAdmin';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { address, username, fid, displayName, pfpUrl } = await req.json();

    if (!address) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const userRef = adminDb.collection('user').doc(address.toLowerCase());

    await userRef.set(
      {
        farcaster: {
          username,
          fid,
          displayName,
          pfpUrl,
        },
      },
      { merge: true },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Error storing Farcaster profile:', error);
    return NextResponse.json({ error: 'Failed to store Farcaster profile' }, { status: 500 });
  }
}
