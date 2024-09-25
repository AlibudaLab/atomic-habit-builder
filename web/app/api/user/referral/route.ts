import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../src/utils/firebaseAdmin';
import { generateUniqueCode } from '@/utils/referralCode';
import { DocumentSnapshot } from 'firebase-admin/firestore';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const userRef = adminDb.collection('user').doc(address.toLowerCase());
  const userDoc: DocumentSnapshot = await userRef.get();

  if (!userDoc.exists) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const data = userDoc.data();
  if (!data?.referralCode) {
    return NextResponse.json({
      referralCode: null,
      message: 'User exists but has no referral code',
    });
  }

  const referralRef = adminDb.collection('referrals').doc(data.referralCode);
  const referralDoc = await referralRef.get();

  if (!referralDoc.exists) {
    return NextResponse.json(
      { error: 'Referral code exists in user data but not in referrals collection' },
      { status: 500 },
    );
  }

  return NextResponse.json({ referralCode: data.referralCode });
}

export async function POST(req: NextRequest): Promise<Response> {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const referralsCollection = adminDb.collection('referrals');

  let referralCode: string;
  let referralRef;
  do {
    referralCode = generateUniqueCode();
    referralRef = referralsCollection.doc(referralCode);
    const referralDoc = await referralRef.get();
    if (!referralDoc.exists) {
      await referralRef.set({
        owner: address.toLowerCase(),
        createdAt: Date.now(),
        usageCount: 0,
        invited: [],
        isActive: true,
      });
      break;
    }
  } while (true);

  return NextResponse.json({ referralCode });
}

export const dynamic = 'force-dynamic';
