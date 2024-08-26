import { toHex } from 'viem';
import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../../configs';
import { CheckInCountQueryResult } from '../../utils/types';


export async function GET(
  req: NextRequest,
  { params }: { params: { user: string; challengeId: string } },
): Promise<NextResponse> {
  try {
    const { user, challengeId } = params;

    const query = `
      query ($id: ID!) {
        userChallenge(id: $id) {
          checkIns {
            id
          }
        }
      }
    `;

    const variables: { id: string } = {
      id: user.toLowerCase() + toHex(challengeId),
    };

    const data = await subgraphClient.request<CheckInCountQueryResult>(query, variables);

    if (!data.userChallenge) {
      return NextResponse.json({ error: 'User challenge not found' }, { status: 404 });
    }

    const checkInCount = data.userChallenge.checkIns.length;

    return NextResponse.json({
      checkInCount,
      challengeId,
      userAddress: user,
    });
  } catch (error) {
    console.error('[API] Error fetching user challenge check-in count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user challenge check-in count' },
      { status: 500 },
    );
  }
}
