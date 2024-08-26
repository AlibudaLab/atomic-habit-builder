// web/app/api/on-chain/[user]/challenges/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../../configs';
import { UserQueryResult, ChallengeWithUserStatus } from '../../utils/types';

export async function GET(
  req: NextRequest,
  { params }: { params: { user: string } },
): Promise<NextResponse> {
  try {
    const { user } = params;
    const searchParams = req.nextUrl.searchParams;
    const amount = parseInt(searchParams.get('amount') ?? '10', 10);
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const skip = (page - 1) * amount;

    const query = `
      query ($id: ID!, $first: Int!, $skip: Int!) {
        user(id: $id) {
            challengeHistory(
                first: $first
                skip: $skip
            ) {
                challengeId {
                id
                startTimestamp
                status
                }
                status
            }
            totalJoinedChallenges
        }
      }
    `;

    const variables: { id: string; first: number; skip: number } = {
      id: user.toLowerCase(),
      first: amount,
      skip,
    };

    const data = await subgraphClient.request<UserQueryResult>(query, variables);

    if (!data.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const challenges: ChallengeWithUserStatus[] = data.user.challengeHistory.map((ch) => ({
      ...ch.challengeId,
      userStatus: ch.status,
    }));

    return NextResponse.json({
      challenges,
      total: parseInt(data.user.totalJoinedChallenges),
      page,
      pageSize: amount,
    });
  } catch (error) {
    console.error('[API] Error fetching user challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch user challenges' }, { status: 500 });
  }
}
