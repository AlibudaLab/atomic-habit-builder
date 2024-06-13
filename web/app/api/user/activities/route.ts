import { NextRequest, NextResponse } from 'next/server';

import { adminDb } from '../../../../src/utils/firebaseAdmin';

/**
 * Append a new "activity" to users' activityMap
 * @param req
 * @returns
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();

    if (!payload.user || !payload.challengeId || !payload.activityId) {
      return NextResponse.json({ error: 'Missing Args' }, { status: 400 });
    }
    const user = payload.user.toLowerCase();
    const challengeId = payload.challengeId;
    const activityId = payload.activityId;

    // find the user, with his address as key
    const userRef = adminDb.collection('user').doc(user);

    // if user doc exists, update the activityMap with {challengeId: [... append activityId]}
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const data = userDoc.data();
      const activityMap = data ? data.activityMap || {} : {};

      if (activityMap[challengeId]) {
        activityMap[challengeId].push(activityId);
      } else {
        activityMap[challengeId] = [activityId];
      }

      await userRef.update({ activityMap });
    } else {
      // if user doc does not exist, create a new doc with activityMap
      const activityMap = {
        [challengeId]: [payload.activityId],
      };

      await userRef.set({ activityMap });
    }

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error('Error adding challenge:', error);
    return NextResponse.json({ error: 'Failed to add challenge' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
