/**
 * Chat feature type definitions
 * Compatible with Vercel AI SDK
 */

/**
 * Chat message model (compatible with Vercel AI SDK)
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

/**
 * Message part types for multimodal support
 */
export type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'reasoning'; text: string }
  | { type: 'file'; url: string; mediaType: string };

/**
 * Extended message with parts (for multimodal)
 */
export interface ChatMessageWithParts {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
  createdAt?: Date;
}

/**
 * Visibility type for chat sessions
 */
export type VisibilityType = 'private' | 'public';

/**
 * Chat session model
 */
export interface Chat {
  id: string;
  userId: string;
  title?: string;
  visibility: VisibilityType;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * AI Model configuration
 */
export interface ChatModel {
  id: string;
  name: string;
  provider: string;
}

/**
 * BMC (Business Model Canvas) types for chat
 */
export type { BmcChatItem, BmcChatData, BmcChatCoordinates } from './types/bmc';
export { BMC_TAG_CONFIG } from './types/bmc';
