'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LightweightChart } from '@/components/lightweight-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import type { Bar, Instrument, Overlay } from '@/types/market';
import { UTCTimestamp } from 'lightweight-charts';

// A helper to convert Bar to candlestick and volume data formats
const processBarData = (bars: Bar[]) => {
  const candlestickData = bars.map(bar => ({
    time: (new Date(bar.ts_utc).getTime() / 1000) as UTCTimestamp,
    open: bar.o,
    high: bar.h,
    low: bar.l,
    close: bar.c,
  }));
  const volumeData = bars.map(bar => ({
    time: (new Date(bar.ts_utc).getTime() / 1000) as UTCTimestamp,
    value: bar.v,
    color: bar.c > bar.o ? 'hsla(var(--chart-2), 0.5)' : 'hsla(var(--chart-1), 0.5)',
  }));
  return { candlestickData, volumeData };
};

function ChartView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const symbol = (pathname.split('/').pop() || 'MES').toUpperCase();
  const tf = searchParams.get('tf') || '5m';
  const from = searchParams.get('from') || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const to = searchParams.get('to') || new Date().toISOString();
  const overlayParam = searchParams.get('ov');

  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [candlestickData, setCandlestickData] = useState<any[]>([]);
  const [volumeData, setVolumeData] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<Overlay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [instRes, barsRes] = await Promise.all([
          fetch(`/api/instruments/${symbol}`),
          fetch(`/api/bars?symbol=${symbol}&tf=${tf}&from=${from}&to=${to}`)
        ]);
        
        const instData: Instrument = await instRes.json();
        const barsData: Bar[] = await barsRes.json();
        
        setInstrument(instData);
        const { candlestickData, volumeData } = processBarData(barsData);
        setCandlestickData(candlestickData);
        setVolumeData(volumeData);
        
      } catch (e) {
        console.error('Failed to fetch chart data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, tf, from, to]);

  useEffect(() => {
    if (overlayParam) {
      try {
        const decoded = atob(overlayParam);
        const parsed = JSON.parse(decoded);
        if (parsed.overlays) {
          setOverlays(parsed.overlays);
        }
      } catch (e) {
        console.error('Failed to parse overlays:', e);
        setOverlays([]);
      }
    } else {
      setOverlays([]);
    }
  }, [overlayParam]);

  if (loading) {
    return <Skeleton className="h-[70vh] w-full" />;
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {instrument?.display || symbol} Chart
        </h1>
        <p className="text-muted-foreground">Timeframe: {tf}</p>
      </header>
      <Card>
        <CardContent className="pt-6">
          <div className="h-[60vh] w-full">
            <LightweightChart
              candlestickData={candlestickData}
              volumeData={volumeData}
              overlays={overlays}
              instrument={instrument}
            />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
            <CardTitle>Chart Details</CardTitle>
        </CardHeader>
        <CardContent>
            <p className="text-sm text-muted-foreground font-code overflow-x-auto">
                Symbol: {symbol} | TF: {tf} | Overlays: {JSON.stringify(overlays)}
            </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ChartPage() {
    return (
        <Suspense fallback={<Skeleton className="h-[70vh] w-full" />}>
            <ChartView />
        </Suspense>
    )
}
