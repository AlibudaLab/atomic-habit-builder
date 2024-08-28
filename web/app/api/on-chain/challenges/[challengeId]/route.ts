import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../../configs';
import { ChallengeQueryResult } from '../../utils/types';
import { convertNumberToBytes, transformChallenge } from '../../utils/conversion';

export async function GET(
  _: NextRequest,
  { params }: { params: { challengeId: number } },
): Promise<Response> {
  try {
    const { challengeId } = params;

    const query = `
      query($id: ID!) {
        challenge(id: $id) {
          id
          verifier
          minimumCheckIns
          startTimestamp
          joinDueTimestamp
          endTimestamp
          donateDestination
          totalUsers
          stakePerUser
          totalStake
          status
          checkInJudge
          asset
          donationBPS
          totalCheckIns
          totalClaims
          totalSucceedUsers
          totalFailedUsers
          joinedUsers {
            user {
              id
            }
          }
        }
      }
    `;

    const variables = { id: convertNumberToBytes(challengeId) };

    const data = await subgraphClient.request<ChallengeQueryResult>(query, variables);

    if (!data.challenge) return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });

    const transformedChallenge = transformChallenge(data.challenge);

    return NextResponse.json(transformedChallenge);
  } catch (error) {
    console.error('[API] Error fetching challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}
