'use server';

import { z } from 'zod';
import {
  analyzeContentForMisinformation,
  type AnalyzeContentOutput,
} from '@/ai/flows/analyze-content-for-misinformation';

const schema = z.object({
  content: z.string().min(10, { message: 'Content must be at least 10 characters long to provide a meaningful analysis.' }).max(5000, { message: 'Content is too long. Please provide a shorter text or a URL.' }),
});

export type FormState = {
  message: string;
  data?: AnalyzeContentOutput | null;
  error?: string;
};

export async function getAnalysis(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const content = formData.get('content');

  // Handle reset case
  if (!content) {
    return { message: 'Ready for new analysis', data: null, error: undefined };
  }

  const validatedFields = schema.safeParse({ content });

  if (!validatedFields.success) {
    return {
      message: 'Invalid form data.',
      error: validatedFields.error.flatten().fieldErrors.content?.[0],
      data: null,
    };
  }

  try {
    const result = await analyzeContentForMisinformation({
      content: validatedFields.data.content,
    });
    if (!result) {
        return { message: 'Analysis failed.', error: 'The analysis returned no result. The content might be too ambiguous or short.', data: null };
    }
    return { message: 'Analysis complete.', data: result };
  } catch (e) {
    console.error(e);
    return { message: 'Analysis failed.', error: 'An unexpected error occurred on our servers. Please try again.', data: null };
  }
}
