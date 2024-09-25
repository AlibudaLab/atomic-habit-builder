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

  // users who never use a referral code
  if (!userDoc.exists) {
    return NextResponse.json({
      referralCode: null,
    });
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
      {
        referralCode: null,
        error: 'Referral code exists in user data but not in referrals collection',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ referralCode: data.referralCode, status: 200 });
}

/**
 * Generates a new referral code, updates the referrals collection and the user document
 * @param req - The request object.
 * @returns - The response object.
 */
export async function POST(req: NextRequest): Promise<Response> {
  const { address } = await req.json();

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  const referralsCollection = adminDb.collection('referrals');
  const userRef = adminDb.collection('user').doc(address.toLowerCase());

  let referralCode: string;
  let referralRef;
  do {
    referralCode = generateUniqueCode();
    referralRef = referralsCollection.doc(referralCode);
    const referralDoc = await referralRef.get();
    if (!referralDoc.exists) {
      // Create new referral document
      await referralRef.set({
        owner: address.toLowerCase(),
        createdAt: Date.now(),
        usageCount: 0,
        invited: [],
        isActive: true,
      });

      // Update user document with the new referral code
      await userRef.set({ referralCode }, { merge: true });

      break;
    }
  } while (true);

  return NextResponse.json({ referralCode });
}

export const dynamic = 'force-dynamic';
