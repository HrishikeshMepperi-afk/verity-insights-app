'use server';
/**
 * @fileOverview Flow for evaluating the credibility of sources cited in analyzed content.
 *
 * - evaluateSourceCredibility - A function that evaluates the credibility of a source.
 * - EvaluateSourceCredibilityInput - The input type for the evaluateSourceCredibility function.
 * - EvaluateSourceCredibilityOutput - The return type for the evaluateSourceCredibility function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EvaluateSourceCredibilityInputSchema = z.object({
  sourceUrl: z.string().url().describe('The URL of the source to evaluate.'),
  topic: z.string().describe('The topic of the content where the source is cited.'),
});
export type EvaluateSourceCredibilityInput = z.infer<typeof EvaluateSourceCredibilityInputSchema>;

const EvaluateSourceCredibilityOutputSchema = z.object({
  credibilityScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score between 0 and 100 representing the credibility of the source.'),
  rationale: z
    .string()
    .describe('The rationale behind the assigned credibility score, explaining the factors considered.'),
});
export type EvaluateSourceCredibilityOutput = z.infer<typeof EvaluateSourceCredibilityOutputSchema>;

export async function evaluateSourceCredibility(
  input: EvaluateSourceCredibilityInput
): Promise<EvaluateSourceCredibilityOutput> {
  return evaluateSourceCredibilityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'evaluateSourceCredibilityPrompt',
  input: {schema: EvaluateSourceCredibilityInputSchema},
  output: {schema: EvaluateSourceCredibilityOutputSchema},
  prompt: `You are an AI assistant specialized in evaluating the credibility of online sources.

  Given the URL of a source and the topic it is cited in, you will assess its trustworthiness and provide a credibility score along with a rationale.

  Source URL: {{{sourceUrl}}}
  Topic: {{{topic}}}

  Instructions:
  1. Analyze the source's domain, content, and reputation.
  2. Consider factors such as the source's history, transparency, fact-checking practices, and potential biases.
  3. Provide a credibility score between 0 and 100, where 0 is completely untrustworthy and 100 is highly trustworthy.
  4. Explain the rationale behind the assigned score, highlighting the key factors that influenced your assessment.

  Output:
  - credibilityScore: The credibility score (0-100).
  - rationale: The detailed rationale for the score.
  Follow the output schema description.
  Remember to output a valid JSON.
  `,
});

const evaluateSourceCredibilityFlow = ai.defineFlow(
  {
    name: 'evaluateSourceCredibilityFlow',
    inputSchema: EvaluateSourceCredibilityInputSchema,
    outputSchema: EvaluateSourceCredibilityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
