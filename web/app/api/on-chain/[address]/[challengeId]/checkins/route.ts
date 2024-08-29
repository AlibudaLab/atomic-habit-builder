import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../../../configs';
import { CheckInCountQueryResult } from '../../../utils/types';
import { convertNumberToBytes } from 'app/api/on-chain/utils/conversion';

export async function GET(
  _: NextRequest,
  { params }: { params: { address: string; challengeId: number } },
): Promise<NextResponse> {
  try {
    const { address, challengeId } = params;

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
      id: address.toLowerCase() + convertNumberToBytes(challengeId).slice(2),
    };

    const data = await subgraphClient.request<CheckInCountQueryResult>(query, variables);

    if (!data.userChallenge) {
      return NextResponse.json({ error: 'User challenge not found' }, { status: 404 });
    }

    const checkInCount = data.userChallenge.checkIns.length;

    return NextResponse.json({
      address,
      challengeId,
      checkInCount
    });
  } catch (error) {
    console.error('[API] Error fetching user challenge check-in count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user challenge check-in count' },
      { status: 500 },
    );
  }
}
