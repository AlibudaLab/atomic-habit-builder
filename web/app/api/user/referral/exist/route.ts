import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../../src/utils/firebaseAdmin';

export async function GET(req: NextRequest): Promise<Response> {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  const referralRef = adminDb.collection('referrals').doc(code);
  const referralDoc = await referralRef.get();

  const exist = referralDoc.exists;
  return NextResponse.json({ exist, status: 200 });
}

export const revalidate = 0;
