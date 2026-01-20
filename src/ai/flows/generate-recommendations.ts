
'use server';

/**
 * @fileOverview An AI agent that provides proactive recommendations on how to address potential stress hotspots based on survey data.
 *
 * - generateRecommendations - A function that generates recommendations based on the analysis of survey data.
 * - GenerateRecommendationsInput - The input type for the generateRecommendations function.
 * - GenerateRecommendationsOutput - The return type for the generateRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateRecommendationsInputSchema = z.object({
  domainScores: z.record(z.number()).describe('A map of domain names to their corresponding scores.'),
  demographics: z.record(z.string()).optional().describe('Optional demographic data to tailor the recommendations.'),
});
export type GenerateRecommendationsInput = z.infer<typeof GenerateRecommendationsInputSchema>;

const GenerateRecommendationsOutputSchema = z.object({
  recommendations: z.string().describe('Proactive recommendations to address potential stress hotspots, in Brazilian Portuguese.'),
});
export type GenerateRecommendationsOutput = z.infer<typeof GenerateRecommendationsOutputSchema>;

export async function generateRecommendations(input: GenerateRecommendationsInput): Promise<GenerateRecommendationsOutput> {
  return generateRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRecommendationsPrompt',
  input: {schema: GenerateRecommendationsInputSchema},
  output: {schema: GenerateRecommendationsOutputSchema},
  prompt: `You are an AI assistant specialized in providing proactive recommendations to address potential stress hotspots within a company, based on survey data.
  
  Your response MUST be in Brazilian Portuguese.

  Based on the following domain scores (from 1 to 5, where lower is worse):
  {{#each domainScores}}
    - {{@key}}: {{this}}
  {{/each}}

  {{#if demographics}}
  Considering the following demographic data:
  {{#each demographics}}
    - {{@key}}: {{this}}
  {{/each}}
  {{/if}}

  Provide actionable recommendations for the client admin to address potential stress hotspots.
  Focus on the domains with the lowest scores and suggest specific strategies or initiatives.
  Be concise, practical, and format your response as a single block of text.
  `,
});

const generateRecommendationsFlow = ai.defineFlow(
  {
    name: 'generateRecommendationsFlow',
    inputSchema: GenerateRecommendationsInputSchema,
    outputSchema: GenerateRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
