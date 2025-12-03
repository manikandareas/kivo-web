/**
 * AI model configurations
 */

import type { ChatModel } from '@/features/chat/types';

/**
 * Default chat model to use
 */
export const DEFAULT_CHAT_MODEL = 'o3-mini';

/**
 * Available chat models
 */
export const chatModels: ChatModel[] = [
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'openai',
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
  },
  {
    id: 'o3-mini',
    name: 'O3 Mini (Reasoning)',
    provider: 'openai',
  },
  {
    id: 'o1-mini',
    name: 'O1 Mini (Reasoning)',
    provider: 'openai',
  },
];
