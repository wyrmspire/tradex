import { UTCTimestamp } from 'lightweight-charts';

function generateCandlestickData(startTime: number, count: number, period: number) {
  const data = [];
  let lastClose = 5000;
  for (let i = 0; i < count; i++) {
    const time = (startTime + i * period) as UTCTimestamp;
    const open = lastClose + (Math.random() - 0.5);
    const close = open + (Math.random() - 0.5) * 5;
    const high = Math.max(open, close) + Math.random() * 2;
    const low = Math.min(open, close) - Math.random() * 2;
    lastClose = close;
    data.push({ time, open, high, low, close });
  }
  return data;
}

const now = new Date();
now.setUTCHours(0, 0, 0, 0);
const startTime = Math.floor(now.getTime() / 1000);
const fiveMinutes = 5 * 60;

export const candlestickData = generateCandlestickData(startTime, 100, fiveMinutes);

export const volumeData = candlestickData.map(d => ({
  time: d.time,
  value: Math.random() * 1000 + 100,
  color: d.close > d.open ? 'hsla(var(--chart-2), 0.5)' : 'hsla(var(--chart-1), 0.5)',
}));

export const journalEntries = [
  {
    id: 1,
    title: 'Daily Journal: 2025-09-17',
    type: 'daily',
    date: '2025-09-17',
    path: '/j/d/2025-09-17',
    content: `
## Market Observations
The market opened with strong bullish momentum, breaking through the key resistance level at 5700. Volume was significantly higher than average during the first hour.

> Quote of the day: "The trend is your friend, until the end when it bends."

### Key Trades
- **Long MES @ 5702.50**: Entered on a pullback after the initial breakout.
- **Stop Loss**: 5698.75
- **Target**: 5715.00
- **Outcome**: Target hit. Good execution based on the plan.

## Learnings
Sticking to the plan and not getting shaken out by minor pullbacks was key. The volume confirmation was a crucial signal for the entry. See chart: \`/c/MES?tf=5m&from=...&to=...\`
    `,
  },
  {
    id: 2,
    title: 'Weekly Review: 2025-W38',
    type: 'weekly',
    date: '2025-09-21',
    path: '/j/w/2025-W38',
    content: `
## Weekly Performance
This week was positive, with a net gain of +2.5%. The majority of profits came from momentum trades during the US session.

### What Worked
- Identifying strong intraday trends.
- Risk management was on point; max drawdown was limited to 0.5%.

### What Didn't Work
- Over-trading on Wednesday, leading to small unnecessary losses.

## Plan for Next Week
Focus on quality over quantity. Aim for 1-2 high-probability setups per day.
    `,
  },
  {
    id: 3,
    title: 'Monthly Outlook: 2025-09',
    type: 'monthly',
    date: '2025-09-01',
    path: '/j/m/2025-09',
    content: `
## September 2025 Market Outlook
The long-term trend remains bullish, but we are approaching a major resistance zone on the monthly chart. Expect increased volatility.

### Key Levels to Watch
- **Resistance**: 5800-5850
- **Support**: 5600

## Strategy
- Be cautious with long positions near the resistance zone.
- Look for potential short setups if we see strong rejection at resistance.
    `,
  },
];
