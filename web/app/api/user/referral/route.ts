import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../src/utils/firebaseAdmin';
import { generateUniqueCode } from '@/utils/referralCode';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const userRef = adminDb.collection('user').doc(address.toLowerCase());
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const data = userDoc.data();
    return NextResponse.json({ referralCode: data?.referralCode || null });
  }

  return NextResponse.json({ referralCode: null });
}

export async function POST(req: NextRequest): Promise<Response> {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const userRef = adminDb.collection('user').doc(address.toLowerCase());
  const userDoc = await userRef.get();

  if (userDoc.exists && userDoc.data()?.referralCode) {
    return NextResponse.json({ referralCode: userDoc.data()?.referralCode });
  }

  const referralCode = generateUniqueCode();
  await userRef.set({ referralCode }, { merge: true });

  return NextResponse.json({ referralCode });
}

export const dynamic = 'force-dynamic';
