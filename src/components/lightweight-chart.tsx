'use client';

import { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  UTCTimestamp,
  LineStyle,
  ColorType,
} from 'lightweight-charts';
import type { Overlay, Instrument } from '@/types/market';


interface ChartProps {
  candlestickData: { time: UTCTimestamp; open: number; high: number; low: number; close: number }[];
  volumeData: { time: UTCTimestamp; value: number; color: string }[];
  overlays?: Overlay[];
  instrument: Instrument | null;
}

export function LightweightChart({ candlestickData, volumeData, overlays = [], instrument }: ChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const priceLinesRef = useRef<any[]>([]);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'hsl(var(--card))' },
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
      priceScaleId: '',
    });
    chartRef.current.priceScale('').applyOptions({
      scaleMargins: {
        top: 0.8,
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
    priceLinesRef.current.forEach(line => candlestickSeriesRef.current?.removePriceLine(line));
    priceLinesRef.current = [];

    // Draw new overlays
    if (candlestickSeriesRef.current && instrument) {
      for (const overlay of overlays) {
        if (overlay.type === 'position') {
          const { entry, stop, target, note, qty = 1, showRR = true } = overlay;
          const risk = Math.abs(entry - stop);
          const reward = Math.abs(target - entry);
          const rr = reward / risk;
          const riskDollars = qty * risk * instrument.pointValue;

          const createLine = (price: number, color: string, title: string, lineStyle: LineStyle = LineStyle.Dashed) => {
            if (candlestickSeriesRef.current) {
                const line = candlestickSeriesRef.current.createPriceLine({
                price: price,
                color: color,
                lineWidth: 2,
                lineStyle: lineStyle,
                axisLabelVisible: true,
                title: title,
              });
              priceLinesRef.current.push(line);
              return line;
            }
          };

          createLine(entry, 'hsl(var(--primary))', ` Entry: ${entry}`, LineStyle.Solid);
          createLine(stop, 'hsl(var(--destructive))', ` Stop: ${stop}`);
          createLine(target, 'hsl(var(--chart-2))', ` Target: ${target}`);
          
          if (showRR && candlestickSeriesRef.current) {
            const labelContent = [
                note,
                `R/R: ${rr.toFixed(2)}`,
                `$Risk: ${riskDollars.toFixed(2)}`
            ].filter(Boolean).join(' | ');

            const labelLine = candlestickSeriesRef.current.createPriceLine({
                price: entry + (target > entry ? reward * 1.2 : -reward * 1.2), // Position label slightly away
                color: 'transparent', // Invisible line
                axisLabelVisible: false,
                title: labelContent,
            });
            priceLinesRef.current.push(labelLine);
          }
        }
      }
    }

  }, [candlestickData, volumeData, overlays, instrument]);

  return <div ref={chartContainerRef} className="h-full w-full" />;
}
