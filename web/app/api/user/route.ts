import { NextRequest, NextResponse } from 'next/server';
import { db, collection, getDoc, doc } from '../../../src/utils/firebase';

export async function GET(req: NextRequest): Promise<Response> {
  const payload = await req.json();
  if (!payload.address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  const address = payload.address.toLowerCase();
  const userCollection = collection(db, 'user');
  const userDoc = doc(userCollection, address);
  const userSnapshot = await getDoc(userDoc);

  if (userSnapshot.exists()) {
    const data = userSnapshot.data();
    return NextResponse.json(data);
  } else {
    return NextResponse.json({
      usedMap: {},
    });
  }
}
