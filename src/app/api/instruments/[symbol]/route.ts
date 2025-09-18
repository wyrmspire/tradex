import { NextResponse } from 'next/server';
import { loadInstrument } from '@/lib/data';
import { symbolSchema } from '@/lib/schemas';

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const validation = symbolSchema.safeParse(params.symbol);
  if (!validation.success) {
    return NextResponse.json({ error: 'Invalid symbol' }, { status: 400 });
  }

  const instrument = await loadInstrument(validation.data);
  if (!instrument) {
    return NextResponse.json({ error: 'Instrument not found' }, { status: 404 });
  }

  return NextResponse.json(instrument);
}
