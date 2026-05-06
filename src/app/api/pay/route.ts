import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { transactionId } = body;

    if (!transactionId) {
      return NextResponse.json(
        { status: 'Failed', reason: 'Missing transactionId' },
        { status: 400 }
      );
    }

    // Determine the outcome probabilistically
    const rand = Math.random();

    if (rand < 0.6) {
      // 60% Success
      // Add artificial delay for processing state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ApiResponse = { status: 'Success', transactionId };
      return NextResponse.json(response, { status: 200 });
    } else if (rand < 0.85) {
      // 25% Failed
      // Add artificial delay for processing state
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response: ApiResponse = { status: 'Failed', reason: 'Insufficient funds', transactionId };
      return NextResponse.json(response, { status: 400 });
    } else {
      // 15% Delayed (Timeout simulation)
      // The frontend should timeout at 6s, so we delay for 8s
      await new Promise((resolve) => setTimeout(resolve, 8000));
      const response: ApiResponse = { status: 'Failed', reason: 'Timeout on server', transactionId };
      return NextResponse.json(response, { status: 504 });
    }
  } catch (error) {
    return NextResponse.json(
      { status: 'Failed', reason: 'Invalid request' },
      { status: 400 }
    );
  }
}
