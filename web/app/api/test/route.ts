import { NextRequest, NextResponse } from 'next/server';
import { getChainById } from '@/store/supportedChains';
import { getRpcProviderForChain } from '@/utils/provider';

/**
 * Handler for the /api/chain/blockNumber route, this route will return the current block number
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();
    // Get the Chain Id from the request
    console.log('request body', payload);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Error fetching chains:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
