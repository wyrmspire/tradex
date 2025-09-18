import path from 'path';
import fs from 'fs/promises';
import { eachDayOfInterval, format } from 'date-fns';
import { Bar, Instrument, Timeframe } from '@/types/market';
import { derive5m } from './time';

const DATA_ROOT = path.join(process.cwd(), 'public', 'sample');

export async function listInstruments(): Promise<Instrument[]> {
  const filePath = path.join(DATA_ROOT, 'instruments.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load instruments:', error);
    return [];
  }
}

export async function loadInstrument(symbol: string): Promise<Instrument | null> {
  const instruments = await listInstruments();
  return instruments.find((inst) => inst.symbol === symbol) || null;
}

export async function loadBars(
  symbol: string,
  tf: Timeframe,
  fromUtc: string,
  toUtc: string
): Promise<Bar[]> {
  if (tf === '5m') {
    const bars1m = await loadBars1m(symbol, fromUtc, toUtc);
    return derive5m(bars1m);
  }
  return loadBars1m(symbol, fromUtc, toUtc);
}

async function loadBars1m(symbol: string, fromUtc: string, toUtc: string): Promise<Bar[]> {
  const allBars: Bar[] = [];
  const fromDate = new Date(fromUtc);
  const toDate = new Date(toUtc);

  const dateRange = eachDayOfInterval({ start: fromDate, end: toDate });

  for (const day of dateRange) {
    const dateStr = format(day, 'yyyy-MM-dd');
    const filePath = path.join(DATA_ROOT, 'bars', symbol, '1m', `${dateStr}.json`);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      const dailyBars: Bar[] = JSON.parse(data);
      allBars.push(...dailyBars);
    } catch (error) {
      // It's okay if a file doesn't exist for a given day
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
        console.warn(`Could not load bars for ${symbol} on ${dateStr}:`, error);
      }
    }
  }

  const fromTime = fromDate.getTime();
  const toTime = toDate.getTime();

  return allBars
    .filter((bar) => {
      const barTime = new Date(bar.ts_utc).getTime();
      return barTime >= fromTime && barTime <= toTime;
    })
    .sort((a, b) => new Date(a.ts_utc).getTime() - new Date(b.ts_utc).getTime());
}
