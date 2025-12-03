/**
 * Request Validation Utilities
 * Defines Zod schemas and validation functions for chat API requests
 */

import { z } from 'zod';

/**
 * Schema for message parts (multimodal support)
 */
export const messagePartSchema = z.object({
  type: z.literal('text'),
  text: z.string(),
});

/**
 * Schema for chat message
 */
export const chatMessageSchema = z.object({
  id: z.string().min(1, 'Message ID is required'),
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1, 'Message content is required'),
  parts: z.array(messagePartSchema).optional(),
});

/**
 * Schema for chat request body
 * Validates all required fields for POST /api/chat
 */
export const chatRequestSchema = z.object({
  id: z.string().uuid('Chat ID must be a valid UUID'),
  message: chatMessageSchema,
  selectedChatModel: z.string().optional().default('gpt-4o-mini'),
});

/**
 * Type inference from schema
 */
export type ChatRequestBody = z.infer<typeof chatRequestSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type MessagePart = z.infer<typeof messagePartSchema>;

/**
 * Validation result type
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Validate chat request body
 * Returns a result object with either validated data or error message
 *
 * @param body - The request body to validate
 * @returns ValidationResult with success status and data or error
 */
export function validateChatRequest(
  body: unknown
): ValidationResult<ChatRequestBody> {
  const result = chatRequestSchema.safeParse(body);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Extract first error message for user-friendly response
  const issues = result.error.issues;
  const firstIssue = issues[0];
  const errorMessage = firstIssue
    ? `${firstIssue.path.join('.')}: ${firstIssue.message}`
    : 'Invalid request body';

  return { success: false, error: errorMessage };
}

/**
 * Check if a request body has all required fields
 * This is a simpler check that returns boolean
 *
 * @param body - The request body to check
 * @returns true if all required fields are present and valid
 */
export function isValidChatRequest(body: unknown): boolean {
  return chatRequestSchema.safeParse(body).success;
}
