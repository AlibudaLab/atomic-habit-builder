import { NextRequest, NextResponse } from 'next/server';
import { createWalletClient, http, parseEther } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { baseSepolia } from 'viem/chains';

/**
 * Handler for the /api/chain/blockNumber route, this route will return the current block number
 * @param req
 * @param res
 */
export async function POST(req: NextRequest): Promise<Response> {
  try {
    const payload = await req.json();
    // Get notification
    if(payload?.event == 'onramp.trade.succeeded') {
      // Get the destination wallet
      const destinationWallet = payload.data.destinationWallet;
      // Create account with private key
      const client = createWalletClient({
        chain: baseSepolia,
        transport: http()
      })
      const account = privateKeyToAccount(`0x${process.env.FAUCET_PRIVATE_KEY}`);
      // Airdrop eth to the user
      const hash = await client.sendTransaction({ 
        account,
        chain: baseSepolia,
        to: destinationWallet,
        value: parseEther(payload.data.cryptoAmount)
      })
      return NextResponse.json(hash, { status: 200 });
    } else {
      return NextResponse.json({}, { status: 400, statusText: 'Invalid Payload' });
    }
  } catch (error) {
    console.error('Error bridging ETH:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}

export const dynamic = 'force-dynamic';
