'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  PriceLineOptions,
  LineStyle,
} from 'lightweight-charts';

interface ChartProps {
  candlestickData: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[];
  volumeData: { time: UTCTimestamp; value: number; color: string }[];
  overlays?: any[];
}

export function LightweightChart({ candlestickData, volumeData, overlays = [] }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'hsl(var(--background))' },
        textColor: 'hsl(var(--foreground))',
      },
      grid: {
        vertLines: { color: 'hsl(var(--border))' },
        horzLines: { color: 'hsl(var(--border))' },
      },
      crosshair: {
        mode: 1, // Magnet mode
      },
      rightPriceScale: {
        borderColor: 'hsl(var(--border))',
      },
      timeScale: {
        borderColor: 'hsl(var(--border))',
        timeVisible: true,
        secondsVisible: false,
      },
      autoSize: true,
    });

    candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
      upColor: 'hsl(var(--chart-2))',
      downColor: 'hsl(var(--chart-1))',
      borderVisible: false,
      wickUpColor: 'hsl(var(--chart-2))',
      wickDownColor: 'hsl(var(--chart-1))',
    });

    volumeSeriesRef.current = chartRef.current.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '', // Show on a separate pane
    });
    chartRef.current.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.8, // 80% of the pane for volume
        bottom: 0,
      },
    });

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.resize(chartContainerRef.current.clientWidth, chartContainerRef.current.clientHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (candlestickSeriesRef.current) {
      candlestickSeriesRef.current.setData(candlestickData);
    }
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(volumeData);
    }
    chartRef.current?.timeScale().fitContent();

    // Clear previous overlays
    candlestickSeriesRef.current?.getPrerenderedData().priceLines.forEach(line => candlestickSeriesRef.current?.removePriceLine(line));


    // Draw new overlays
    if (candlestickSeriesRef.current) {
      for (const overlay of overlays) {
        if (overlay.type === 'position') {
          const { entry, stop, target, note } = overlay;
          const risk = Math.abs(entry - stop);
          const reward = Math.abs(target - entry);
          const rr = reward / risk;

          const createLine = (price: number, color: string, title: string, lineStyle: LineStyle = LineStyle.Dashed) => {
            if (candlestickSeriesRef.current) {
              return candlestickSeriesRef.current.createPriceLine({
                price: price,
                color: color,
                lineWidth: 2,
                lineStyle: lineStyle,
                axisLabelVisible: true,
                title: title,
              });
            }
          };

          createLine(entry, 'hsl(var(--primary))', ` Entry: ${entry}`, LineStyle.Solid);
          createLine(stop, 'hsl(var(--destructive))', ` Stop: ${stop}`);
          createLine(target, 'hsl(var(--chart-2))', ` Target: ${target}`);
          
          if (overlay.showRR && candlestickSeriesRef.current) {
            candlestickSeriesRef.current.createPriceLine({
                price: entry + (target > entry ? reward * 1.2 : -reward * 1.2), // Position label slightly away
                color: 'transparent', // Invisible line
                axisLabelVisible: false,
                title: `${note ? note + ' ' : ''}(R/R: ${rr.toFixed(2)})`,
            });
          }
        }
      }
    }

  }, [candlestickData, volumeData, overlays]);

  return <div ref={chartContainerRef} className="h-full w-full" />;
}
