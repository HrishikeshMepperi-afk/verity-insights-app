'use server';
/**
 * @fileOverview Analyzes content for potential misinformation.
 *
 * - analyzeContentForMisinformation - Analyzes the given text or URL content for misinformation.
 * - AnalyzeContentInput - The input type for the analyzeContentForMisinformation function.
 * - AnalyzeContentOutput - The return type for the analyzeContentForMisinformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeContentInputSchema = z.object({
  content: z.string().describe('The text or URL content to analyze.'),
});
export type AnalyzeContentInput = z.infer<typeof AnalyzeContentInputSchema>;

const AnalyzeContentOutputSchema = z.object({
  isMisinformation: z
    .boolean()
    .describe('Whether the content is likely to contain misinformation.'),
  confidenceScore: z
    .number()
    .describe('A score indicating the confidence level of the misinformation analysis.'),
  supportingEvidence: z
    .string()
    .describe('Supporting evidence found during the analysis.'),
  sourceCredibilityScore: z
    .number()
    .describe('The credibility score of the source of the content.'),
});
export type AnalyzeContentOutput = z.infer<typeof AnalyzeContentOutputSchema>;

export async function analyzeContentForMisinformation(
  input: AnalyzeContentInput
): Promise<AnalyzeContentOutput> {
  return analyzeContentForMisinformationFlow(input);
}

const analyzeContentPrompt = ai.definePrompt({
  name: 'analyzeContentPrompt',
  input: {schema: AnalyzeContentInputSchema},
  output: {schema: AnalyzeContentOutputSchema},
  prompt: `You are an AI agent designed to detect misinformation in text content.

  Analyze the following content and determine if it contains misinformation. Provide a confidence score and supporting evidence for your analysis.

  Content: {{{content}}}
  `,
});

const analyzeContentForMisinformationFlow = ai.defineFlow(
  {
    name: 'analyzeContentForMisinformationFlow',
    inputSchema: AnalyzeContentInputSchema,
    outputSchema: AnalyzeContentOutputSchema,
  },
  async input => {
    const {output} = await analyzeContentPrompt(input);
    return output!;
  }
);
