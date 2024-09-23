import { NextRequest, NextResponse } from 'next/server';

import { adminDb } from '../../../src/utils/firebaseAdmin';

// {
//   name: string,
//   description: string,
//   type: string,
//   public: boolean,
//   challengeId: number
//   accessCode?: string,
//   minDistance: number,
//   minTime: number,
//   user?: string,
//   allowSelfCheckIn?: boolean,
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
      minDistance: payload.minDistance * 1000,
      minTime: payload.minTime * 60,
      id: payload.challengeId,
      creator: payload.user,
      allowSelfCheckIn: payload.allowSelfCheckIn === true,
    });

    console.log('Document challenge-metadata written with ID: ', docRef.id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
