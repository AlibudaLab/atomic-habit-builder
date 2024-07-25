import { NextRequest, NextResponse } from 'next/server';
import { db, collection, getDocsFromServer } from '../../../src/utils/firebase';
import { revalidateTag } from 'next/cache';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    revalidateTag('fetch');
    const querySnapshot = await getDocsFromServer(collection(db, 'challenge-metadata'));
    const challenges = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
