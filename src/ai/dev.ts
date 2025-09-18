import { config } from 'dotenv';
config();

import '@/ai/flows/derive-timeframes-and-fill-gaps.ts';
import '@/ai/flows/generate-journal-summary.ts';