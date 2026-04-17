"use server";

import { suggestCaptions, AICaptionSuggestionOutput } from "@/ai/flows/ai-caption-suggestion";

export async function getAiCaptions(
  videoContext: string
): Promise<AICaptionSuggestionOutput> {
  if (!videoContext) {
    throw new Error("Video context is required to generate captions.");
  }
  
  try {
    const result = await suggestCaptions({ videoContext });
    return result;
  } catch (error) {
    console.error("Error generating AI captions:", error);
    throw new Error("Failed to generate AI captions. Please try again.");
  }
}
