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

      if (payload.user === undefined) {
        return NextResponse.json(
          { error: 'User is required for private challenges' },
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
    });

    console.log('Document challenge-metadata written with ID: ', docRef.id);

    const user = payload.user.toLowerCase();
    const challengeId = payload.challengeId;

    // add user to user-private-challenges collection
    const userChallengesCollet = await adminDb
      .collection('user-private-challenges')
      .where('user', '==', user)
      .get();

    // append to the collection.joined array if user already exists
    if (userChallengesCollet.docs.length > 0) {
      const userDoc = userChallengesCollet.docs[0];
      await userDoc.ref.update({
        joined: userDoc.data().joined.concat(challengeId),
      });
    } else {
      await adminDb.collection('user-private-challenges').add({
        user: user,
        joined: [challengeId],
      });
    }

    console.log('Document challenge-users written with ID: ', user.id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
