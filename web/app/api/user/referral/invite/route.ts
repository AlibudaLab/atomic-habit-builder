import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../src/utils/firebaseAdmin';

export async function POST(req: NextRequest): Promise<Response> {
  const { inviteeAddress, referralCode } = await req.json();

  if (!inviteeAddress || !referralCode) {
    return NextResponse.json({ error: 'Missing inviteeAddress or referralCode' }, { status: 400 });
  }

  const usersRef = adminDb.collection('user');
  const invitorQuery = await usersRef.where('referralCode', '==', referralCode).limit(1).get();

  if (invitorQuery.empty) {
    return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 });
  }

  const invitorDoc = invitorQuery.docs[0];
  const invitorData = invitorDoc.data();
  const invitedArray = invitorData.invited || [];

  if (!invitedArray.includes(inviteeAddress.toLowerCase())) {
    invitedArray.push(inviteeAddress.toLowerCase());
    await invitorDoc.ref.update({ invited: invitedArray });
  }

  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';
