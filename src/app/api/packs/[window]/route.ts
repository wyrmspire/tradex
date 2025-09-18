import { NextResponse } from 'next/server';
import { loadBars } from '@/lib/data';
import { symbolSchema, tfSchema } from '@/lib/schemas';
import { windowPresets } from '@/lib/time';
import { DataPack } from '@/types/market';

export async function GET(
  request: Request,
  { params }: { params: { window: string } }
) {
  const { searchParams } = new URL(request.url);
  const windowName = params.window;
  
  const symbolResult = symbolSchema.safeParse(searchParams.get('symbol'));
  if (!symbolResult.success) {
    return NextResponse.json({ error: 'Invalid symbol parameter' }, { status: 400 });
  }
  const symbol = symbolResult.data;

  const presetFn = windowPresets[windowName];
  if (!presetFn) {
    return NextResponse.json({ error: 'Invalid window preset' }, { status: 400 });
  }
  
  const { fromUtc, toUtc } = presetFn();
  const tf = windowName === 'last10m_1m' ? '1m' : '5m';

  try {
    const bars = await loadBars(symbol, tf, fromUtc, toUtc);
    const dataPack: DataPack = {
      symbol,
      tf,
      tz: 'America/Chicago',
      from_utc: fromUtc,
      to_utc: toUtc,
      bars,
    };
    return NextResponse.json(dataPack);
  } catch (error) {
    console.error(`Failed to create data pack for ${windowName}:`, error);
    return NextResponse.json({ error: 'Failed to create data pack' }, { status: 500 });
  }
}
