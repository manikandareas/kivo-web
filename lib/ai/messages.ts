/**
 * Message Transformation Utilities
 * Functions for converting and managing chat messages
 */

import type { ChatMessage } from './validation';

/**
 * Model-compatible message format
 * This is the format expected by AI SDK's streamText function
 */
export interface ModelMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Default context limit (number of messages to keep)
 */
export const DEFAULT_CONTEXT_LIMIT = 50;

/**
 * Convert a ChatMessage from the frontend to a model-compatible format
 * Preserves the role and content while stripping unnecessary fields
 *
 * @param message - The ChatMessage from frontend
 * @returns ModelMessage compatible with AI SDK
 *
 * **Validates: Requirements 6.2**
 */
export function convertToModelMessage(message: ChatMessage): ModelMessage {
  return {
    role: message.role,
    content: message.content,
  };
}

/**
 * Convert an array of ChatMessages to model-compatible format
 *
 * @param messages - Array of ChatMessages from frontend
 * @returns Array of ModelMessages compatible with AI SDK
 *
 * **Validates: Requirements 6.2**
 */
export function convertToModelMessages(
  messages: ChatMessage[]
): ModelMessage[] {
  return messages.map(convertToModelMessage);
}

/**
 * Truncate messages array to fit within context limits
 * Preserves the N most recent messages in chronological order
 *
 * @param messages - Array of messages to truncate
 * @param limit - Maximum number of messages to keep (default: DEFAULT_CONTEXT_LIMIT)
 * @returns Truncated array with most recent messages preserved
 *
 * **Validates: Requirements 6.3**
 */
export function truncateMessages<T>(
  messages: T[],
  limit: number = DEFAULT_CONTEXT_LIMIT
): T[] {
  if (messages.length <= limit) {
    return messages;
  }

  // Keep the most recent messages (from the end of the array)
  return messages.slice(-limit);
}
