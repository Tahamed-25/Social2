'use server';
/**
 * @fileOverview An AI agent for generating creative caption suggestions for videos.
 *
 * - suggestCaptions - A function that handles the caption suggestion process.
 * - AICaptionSuggestionInput - The input type for the suggestCaptions function.
 * - AICaptionSuggestionOutput - The return type for the suggestCaptions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AICaptionSuggestionInputSchema = z.object({
  videoContext: z
    .string()
    .describe(
      'A description of the video content, theme, or keywords to generate caption suggestions.'
    ),
});
export type AICaptionSuggestionInput = z.infer<
  typeof AICaptionSuggestionInputSchema
>;

const AICaptionSuggestionOutputSchema = z.object({
  captions: z.array(z.string()).describe('A list of suggested captions for the video.'),
});
export type AICaptionSuggestionOutput = z.infer<
  typeof AICaptionSuggestionOutputSchema
>;

export async function suggestCaptions(
  input: AICaptionSuggestionInput
): Promise<AICaptionSuggestionOutput> {
  return aiCaptionSuggestionFlow(input);
}

const captionSuggestionPrompt = ai.definePrompt({
  name: 'captionSuggestionPrompt',
  input: {schema: AICaptionSuggestionInputSchema},
  output: {schema: AICaptionSuggestionOutputSchema},
  prompt: `You are a creative social media caption generator.

Generate 3-5 engaging and relevant short caption suggestions for a video based on the following context:

Video Context: {{{videoContext}}}

Ensure the captions are suitable for a fitness-oriented social platform and encourage interaction.`, 
});

const aiCaptionSuggestionFlow = ai.defineFlow(
  {
    name: 'aiCaptionSuggestionFlow',
    inputSchema: AICaptionSuggestionInputSchema,
    outputSchema: AICaptionSuggestionOutputSchema,
  },
  async (input) => {
    const {output} = await captionSuggestionPrompt(input);
    return output!;
  }
);
