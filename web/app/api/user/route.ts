import { NextRequest, NextResponse } from 'next/server';
import { db, collection, getDoc, doc } from '../../../src/utils/firebase';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const user = req.nextUrl.searchParams.get('address');
    if (!user) {
      return NextResponse.json({ error: 'Address is required' }, { status: 400 });
    }

    const address = user.toLowerCase();
    const userCollection = collection(db, 'user');
    const userDoc = doc(userCollection, address);

    const userSnapshot = await getDoc(userDoc);

    if (userSnapshot.exists()) {
      const data = userSnapshot.data();

      return NextResponse.json(data);
    } else {
      return NextResponse.json({
        activityMap: {},
      });
    }
  } catch (error) {
    console.error('[API] Error fetching user:', error);

    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
