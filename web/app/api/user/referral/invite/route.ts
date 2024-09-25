import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../src/utils/firebaseAdmin';

export async function POST(req: NextRequest): Promise<Response> {
  const { inviteeAddress, referralCode } = await req.json();

  if (!inviteeAddress || !referralCode) {
    return NextResponse.json({ error: 'Missing inviteeAddress or referralCode' }, { status: 400 });
  }

  const referralRef = adminDb.collection('referrals').doc(referralCode);
  const referralDoc = await referralRef.get();

  if (!referralDoc.exists) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
  }

  const referralData = referralDoc.data() || { invited: [], usageCount: 0 };
  const invitedArray = referralData.invited || [];

  if (!invitedArray.includes(inviteeAddress.toLowerCase())) {
    invitedArray.push(inviteeAddress.toLowerCase());
    await referralRef.update({
      invited: invitedArray,
      usageCount: (referralData.usageCount || 0) + 1,
    });
  }

  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';
