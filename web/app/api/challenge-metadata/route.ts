// pages/api/challenges.ts
import { NextRequest, NextResponse } from 'next/server';
import { db, collection, getDocs, addDoc } from '../../../src/utils/firebase';

export async function GET(req: NextRequest): Promise<Response> {
  try {
    const querySnapshot = await getDocs(collection(db, 'challenge-metadata'));
    const challenges = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(challenges, { status: 200 });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();
    const docRef = await addDoc(collection(db, 'challenge-metadata'), {
      name: payload.name,
      description: payload.description,
      type: payload.type,
      public: payload.public,
    });
    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}
