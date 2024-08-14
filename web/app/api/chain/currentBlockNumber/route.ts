import { NextRequest, NextResponse } from 'next/server';
import { getRpcProviderForChain } from '@/utils/provider';
import { getChainsForEnvironment } from '@/store/supportedChains';

const expectedChain = getChainsForEnvironment();

/**
 * Handler for the /api/chain/blockNumber route, this route will return the current block number
 * @param req
 * @param res
 */
export async function GET(req: NextRequest): Promise<Response> {
  const chainId = req.nextUrl.searchParams.get('chainId');
  try {
    // Get the Chain Id from the request
    if (!chainId) {
      return NextResponse.json({ error: 'chainid is required' }, { status: 400 });
    }
    if (chainId !== expectedChain.id.toString()) {
      return NextResponse.json({ error: 'chain not supported' }, { status: 400 });
    }
    const provider = getRpcProviderForChain(expectedChain);
    const block = await provider.getBlockNumber();
    return NextResponse.json({ block: block.toString() }, { status: 200 });
  } catch (error) {
    console.error('Error fetching chains:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
