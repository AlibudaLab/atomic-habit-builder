import { NextRequest, NextResponse } from 'next/server';

import { adminDb } from '../../../src/utils/firebaseAdmin';

// {
//   name: string,
//   description: string,
//   type: string,
//   public: boolean,
//   challengeId: number
//   accessCode?: string,
//   user?: string,
// }
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();

    const isPrivate = payload.public === false;
    if (isPrivate) {
      if (payload.accessCode === undefined) {
        return NextResponse.json(
          { error: 'Access code is required for private challenges' },
          { status: 400 },
        );
      }
    }

    // add metadata to challenge-metadata collection
    const docRef = await adminDb.collection('challenge-metadata').add({
      name: payload.name,
      description: payload.description,
      type: payload.type,
      public: payload.public,
      accessCode: payload.accessCode,
      id: payload.challengeId,
      creator: payload.user,
    });

    console.log('Document challenge-metadata written with ID: ', docRef.id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
