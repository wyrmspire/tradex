'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of a trading journal using AI.
 *
 * It exports:
 * - `generateJournalSummary`: An async function that takes a journal entry as input and returns a summary.
 * - `GenerateJournalSummaryInput`: The input type for the `generateJournalSummary` function.
 * - `GenerateJournalSummaryOutput`: The output type for the `generateJournalSummary` function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateJournalSummaryInputSchema = z.object({
  journalEntry: z.string().describe('The complete text of the journal entry.'),
});
export type GenerateJournalSummaryInput = z.infer<typeof GenerateJournalSummaryInputSchema>;

const GenerateJournalSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the key events and observations from the journal entry.'),
});
export type GenerateJournalSummaryOutput = z.infer<typeof GenerateJournalSummaryOutputSchema>;

export async function generateJournalSummary(input: GenerateJournalSummaryInput): Promise<GenerateJournalSummaryOutput> {
  return generateJournalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalSummaryPrompt',
  input: { schema: GenerateJournalSummaryInputSchema },
  output: { schema: GenerateJournalSummaryOutputSchema },
  prompt: `You are an AI assistant that summarizes trading journals.

  Given the following journal entry, create a concise summary of the key events and observations. The summary should be no more than 3 sentences.

  Journal Entry:
  {{journalEntry}}
  `,
});

const generateJournalSummaryFlow = ai.defineFlow(
  {
    name: 'generateJournalSummaryFlow',
    inputSchema: GenerateJournalSummaryInputSchema,
    outputSchema: GenerateJournalSummaryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
