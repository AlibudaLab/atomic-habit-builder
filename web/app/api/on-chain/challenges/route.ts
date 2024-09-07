import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../configs';
import { ChallengesQueryResult } from '../utils/types';
import { transformChallenge } from '../utils/conversion';

export async function GET(req: NextRequest): Promise<Response> {
  const searchParams = req.nextUrl.searchParams;
  const amount = parseInt(searchParams.get('amount') ?? '100', 10);
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const skip = (page - 1) * amount;
  try {
    const query = `
      query($first: Int!, $skip: Int!) {
        challenges(first: $first, skip: $skip, orderBy: id, orderDirection: asc) {
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
          joinedUsers {
            user {
              id
            }
            totalCheckIns
          }
        }
        latestChallenge: challenges(first: 1, orderBy: id, orderDirection: desc) {
          id
        }
      }
    `;

    const variables = {
      first: amount,
      skip: skip,
    };

    const data = await subgraphClient.request<ChallengesQueryResult>(query, variables);

    const transformedChallenges = data.challenges.map(transformChallenge);

    const totalChallenges =
      data.latestChallenge.length > 0 ? parseInt(data.latestChallenge[0].id, 10) : 0;

    return NextResponse.json({
      challenges: transformedChallenges,
      total: totalChallenges,
      page: page,
      pageSize: amount,
    });
  } catch (error) {
    console.log('[API] Error fetching challenges:', error);
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 });
  }
}
