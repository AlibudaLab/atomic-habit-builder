import { NextRequest, NextResponse } from 'next/server';
import queryString from 'query-string';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    // Parse the request body
    const payload = await req.json();
    const stringified = queryString.stringify(payload);
    console.log(stringified);
    const response = await fetch(`https://api.cloudnouns.com/v1/pfp?${stringified}`);
    const svgText = await response.text();
    return NextResponse.json({ svgText }, { status: 200 });
  } catch (error) {
    console.error('Error getting Nouns image:', error);
    return NextResponse.json({}, { status: 500, statusText: 'Internal Server Error' });
  }
}
