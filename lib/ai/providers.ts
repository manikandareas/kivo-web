/**
 * AI Provider Configuration
 * Configures OpenAI provider using Vercel AI SDK
 */

import { createOpenAI } from '@ai-sdk/openai';
import { DEFAULT_CHAT_MODEL, chatModels } from './models';

/**
 * OpenAI provider instance configured with API key from environment
 */
export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get AI model instance by model ID
 * Falls back to default model if specified model is not available
 *
 * @param modelId - The model ID to use (e.g., 'gpt-4o-mini', 'gpt-4o')
 * @returns The AI model instance
 */
export function getModel(modelId?: string) {
  const targetModelId = modelId ?? DEFAULT_CHAT_MODEL;

  // Check if the model is available in our configured models
  const isAvailable = chatModels.some((model) => model.id === targetModelId);

  // Use the requested model if available, otherwise fall back to default
  const finalModelId = isAvailable ? targetModelId : DEFAULT_CHAT_MODEL;

  return openai(finalModelId);
}
