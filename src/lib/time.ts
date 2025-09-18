import {
  startOfWeek,
  endOfWeek,
  startOfHour,
  subHours,
  subMinutes,
  subDays,
  setHours,
  startOfDay,
} from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const CHICAGO_TZ = 'America/Chicago';

function getNowInChicago() {
  return toZonedTime(new Date(), CHICAGO_TZ);
}

export function getWeeklyWindow() {
  const now = getNowInChicago();
  const from = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const to = endOfWeek(now, { weekStartsOn: 1 });
  return {
    fromUtc: from.toISOString(),
    toUtc: to.toISOString(),
  };
}

export function getOvernightWindow() {
  const now = getNowInChicago();
  let from: Date;
  let to: Date;

  if (now.getHours() < 8) {
    // Before 8 AM CT, so overnight session is from yesterday 6 PM to today 8:30 AM
    const yesterday = subDays(now, 1);
    from = setHours(yesterday, 18);
    to = setHours(now, 8);
    to.setMinutes(30);
  } else {
    // After 8 AM CT, so overnight session is from today 6 PM to tomorrow 8:30 AM
    from = setHours(now, 18);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    to = setHours(tomorrow, 8);
    to.setMinutes(30);
  }

  return {
    fromUtc: fromZonedTime(from, CHICAGO_TZ).toISOString(),
    toUtc: fromZonedTime(to, CHICAGO_TZ).toISOString(),
  };
}


export function getTwoHourWindow() {
  const now = getNowInChicago();
  const from = subHours(startOfHour(now), 2);
  return {
    fromUtc: from.toISOString(),
    toUtc: now.toISOString(),
  };
}

export function getLast30m() {
  const now = getNowInChicago();
  const from = subMinutes(now, 30);
  return {
    fromUtc: from.toISOString(),
    toUtc: now.toISOString(),
  };
}

export function getLast10m() {
  const now = getNowInChicago();
  const from = subMinutes(now, 10);
  return {
    fromUtc: from.toISOString(),
    toUtc: now.toISOString(),
  };
}

export const windowPresets: Record<
  string,
  () => { fromUtc: string; toUtc: string }
> = {
  weekly_window: getWeeklyWindow,
  overnight_window: getOvernightWindow,
  two_hour_window: getTwoHourWindow,
  last30m_5m: getLast30m,
  last10m_1m: getLast10m,
};


import type { Bar } from '@/types/market';

export function derive5m(bars1m: Bar[]): Bar[] {
    if (!bars1m || bars1m.length === 0) {
        return [];
    }

    const bars5m: Bar[] = [];
    let currentBucket: Bar | null = null;
    let bucketTimestamp: number | null = null;

    for (const bar of bars1m) {
        const barTime = new Date(bar.ts_utc).getTime();
        const minute = new Date(bar.ts_utc).getUTCMinutes();
        const bucketStartMinute = minute - (minute % 5);
        
        const currentBarTime = new Date(bar.ts_utc);
        currentBarTime.setUTCMinutes(bucketStartMinute, 0, 0);
        const newBucketTimestamp = currentBarTime.getTime();

        if (bucketTimestamp !== newBucketTimestamp) {
            if (currentBucket) {
                bars5m.push(currentBucket);
            }

            bucketTimestamp = newBucketTimestamp;
            currentBucket = {
                ts_utc: new Date(bucketTimestamp).toISOString(),
                o: bar.o,
                h: bar.h,
                l: bar.l,
                c: bar.c,
                v: bar.v,
                tf: '5m',
                symbol: bar.symbol,
            };
        } else if(currentBucket) {
            currentBucket.h = Math.max(currentBucket.h, bar.h);
            currentBucket.l = Math.min(currentBucket.l, bar.l);
            currentBucket.c = bar.c;
            currentBucket.v += bar.v;
        }
    }

    if (currentBucket) {
        bars5m.push(currentBucket);
    }

    return bars5m;
}
