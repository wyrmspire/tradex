import { NextResponse } from 'next/server';
import { loadBars } from '@/lib/data';
import { tfSchema, isoSchema, symbolSchema } from '@/lib/schemas';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const symbolResult = symbolSchema.safeParse(searchParams.get('symbol'));
  const tfResult = tfSchema.safeParse(searchParams.get('tf'));
  const fromResult = isoSchema.safeParse(searchParams.get('from'));
  const toResult = isoSchema.safeParse(searchParams.get('to'));

  if (!symbolResult.success || !tfResult.success || !fromResult.success || !toResult.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  }

  const { data: symbol } = symbolResult;
  const { data: tf } = tfResult;
  const { data: from } = fromResult;
  const { data: to } = toResult;

  try {
    const bars = await loadBars(symbol, tf, from, to);
    return NextResponse.json(bars);
  } catch (error) {
    console.error('Failed to fetch bars:', error);
    return NextResponse.json({ error: 'Failed to fetch bar data' }, { status: 500 });
  }
}
