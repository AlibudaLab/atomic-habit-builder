import { NextRequest, NextResponse } from 'next/server';
import { toHex } from 'viem';
import { subgraphClient } from '../configs';
import { ChallengeQueryResult } from '../utils/types';

//TODO Filter out joinedUsers
export async function GET({ params }: { params: { challengeId: string } }): Promise<Response> {
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

    const variables = { id: toHex(challengeId) };

    const data = await subgraphClient.request<ChallengeQueryResult>(query, variables);

    if (!data.challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 });
    }

    return NextResponse.json(data.challenge);
  } catch (error) {
    console.error('[API] Error fetching challenge:', error);
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 });
  }
}
