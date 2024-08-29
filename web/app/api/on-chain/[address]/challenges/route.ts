import { NextRequest, NextResponse } from 'next/server';
import { subgraphClient } from '../../configs';
import { UserQueryResult } from '../../utils/types';
import { calculateWinningStakePerUser, convertBytesToNumber } from '../../utils/conversion';

export async function GET(
  req: NextRequest,
  { params }: { params: { address: string } },
): Promise<NextResponse> {
  try {
    const { address } = params;
    const searchParams = req.nextUrl.searchParams;
    const amount = parseInt(searchParams.get('amount') ?? '100', 10);
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
                  verifier
                  minimumCheckIns
                  startTimestamp
                  joinDueTimestamp
                  endTimestamp
                  donateDestination
                  totalUsers
                  stakePerUser
                  totalStake
                  totalSucceedUsers
                  donationBPS
                }
                checkIns {
                  id
                }
                status
            }
            totalJoinedChallenges
        }
      }
    `;

    const variables: { id: string; first: number; skip: number } = {
      id: address.toLowerCase(),
      first: amount,
      skip,
    };

    const data = await subgraphClient.request<UserQueryResult>(query, variables);

    if (!data.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const challenges = data.user.challengeHistory.map((ch) => ({
      ...ch.challengeId,
      id: convertBytesToNumber(ch.challengeId.id),
      userStatus: ch.status,
      checkInsCount: ch.checkIns?.length ?? 0,
      winningStakePerUser: calculateWinningStakePerUser(
        BigInt(ch.challengeId.totalUsers),
        BigInt(ch.challengeId.totalSucceedUsers ?? 0),
        BigInt(ch.challengeId.stakePerUser),
        BigInt(ch.challengeId.donationBPS ?? 0),
        ch.status,
      ),
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
