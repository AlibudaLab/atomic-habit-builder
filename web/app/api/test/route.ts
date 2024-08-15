import { NextRequest, NextResponse } from 'next/server';

/**
 * Handler for the /api/chain/blockNumber route, this route will return the current block number
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();
    console.log('request body', payload);
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error('Error fetching chains:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
