export type Timeframe = '1m' | '5m';
export interface Bar { ts_utc: string; o: number; h: number; l: number; c: number; v: number; tf: Timeframe; symbol: string; }
export interface Instrument { symbol: string; tickSize: number; pointValue: number; display: string; }

export type Overlay =
  | { type: 'position'; entry: number; stop: number; target: number; qty?: number; showRR?: boolean; note?: string; colorMode?: 'dark' };

export interface ChartState { symbol: string; timeframe: Timeframe; from_utc: string; to_utc: string; overlays?: Overlay[]; }

export interface DataPack { symbol: string; tf: Timeframe; tz: 'America/Chicago'; from_utc: string; to_utc: string; bars: Bar[]; }
