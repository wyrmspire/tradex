import { z } from 'zod';
export const tfSchema = z.enum(['1m','5m']);
export const isoSchema = z.string().refine(s=>!Number.isNaN(Date.parse(s)),'Invalid ISO date');
export const symbolSchema = z.enum(['MES','MGC']); // extend later
export const overlayPositionSchema = z.object({
  type: z.literal('position'),
  entry: z.number(), stop: z.number(), target: z.number(),
  qty: z.number().optional(), showRR: z.boolean().optional(),
  note: z.string().optional(), colorMode: z.literal('dark').optional()
});
export const overlayBundleSchema = z.object({ overlays: z.array(overlayPositionSchema) });
