import { NextRequest, NextResponse } from 'next/server';

import { adminDb } from '../../../src/utils/firebaseAdmin';

// required data
// {
//   name: string,
//   description: string,
//   type: string,
//   public: boolean,
//   challengeId: string
//   accessCode?: string,
//   user?: string,
// }
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();

    const isPrivate = payload.public === false
    if (isPrivate) {
      if (payload.accessCode === undefined) {
        return NextResponse.json({ error: 'Access code is required for private challenges' }, { status: 400 });
      }
      
      if (payload.user === undefined) {
        return NextResponse.json({ error: 'User is required for private challenges' }, { status: 400 });
      }
    } 

    // add metadata to challenge-metadata collection
    const docRef = await adminDb.collection('challenge-metadata').add({
      name: payload.name,
      description: payload.description,
      type: payload.type,
      public: payload.public,
    });

    console.log('Document challenge-metadata written with ID: ', docRef.id);

    // add user to challenge-users collection
    const userRef = await adminDb.collection('challenge-users').add({
      user: payload.user,
      challengeId: payload.challengeId,
      joined: true
    });

    console.log('Document challenge-users written with ID: ', userRef.id);

    return NextResponse.json({ id: docRef.id }, { status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}
