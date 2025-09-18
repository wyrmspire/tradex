'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { LightweightChart } from '@/components/lightweight-chart';
import { candlestickData, volumeData } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function ChartView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const symbol = (pathname.split('/').pop() || 'MES').toUpperCase();
  const tf = searchParams.get('tf') || '5m';
  const overlayParam = searchParams.get('ov');

  let overlays = [];
  if (overlayParam) {
    try {
      const decoded = atob(overlayParam);
      const parsed = JSON.parse(decoded);
      if (parsed.overlays) {
        overlays = parsed.overlays;
      }
    } catch (e) {
      console.error('Failed to parse overlays:', e);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {symbol} Chart
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
