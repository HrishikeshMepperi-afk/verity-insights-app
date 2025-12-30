import { config } from 'dotenv';
config();

import '@/ai/flows/evaluate-source-credibility.ts';
import '@/ai/flows/analyze-content-for-misinformation.ts';