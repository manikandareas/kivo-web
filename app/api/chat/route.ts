/**
 * Chat API Route
 * POST /api/chat - Handle chat messages and stream AI responses
 *
 * Requirements: 1.1, 1.4, 2.1, 2.2, 2.3, 2.4, 5.1, 5.3
 */

import { convertToModelMessages, streamText, UIMessage } from 'ai';
import { getModel } from '@/lib/ai/providers';
import { getSystemPrompt } from '@/lib/ai/prompts';
import { validateChatRequest } from '@/lib/ai/validation';
import { truncateMessages } from '@/lib/ai/messages';
import type { ChatMessage } from '@/lib/ai/validation';

/**
 * Error response helper
 */
function errorResponse(error: string, code: string, status: number): Response {
  return Response.json({ error, code, status }, { status });
}

/**
 * POST /api/chat
 * Process chat messages and stream AI responses
 */
export async function POST(request: Request): Promise<Response> {
  try {
    const {
      messages,
      selectedChatModel,
    }: { messages: UIMessage[]; selectedChatModel: string } =
      await request.json();

    // Check for API key configuration (Requirements: 4.4)
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not configured');
      return errorResponse('Service configuration error', 'config_error', 500);
    }

    // Get AI model (Requirements: 1.4, 3.3, 3.4)
    const model = getModel(selectedChatModel);

    const result = streamText({
      model,
      system: 'You are a helpful assistant.',
      messages: convertToModelMessages(messages),
      providerOptions: {
        openai: {
          reasoningEffort: 'low',
        },
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    // Handle AI provider errors (Requirements: 2.4, 5.1)
    console.error('Chat API error:', error);

    // Check for specific error types
    if (error instanceof Error) {
      // Rate limit error
      if (
        error.message.includes('rate limit') ||
        error.message.includes('429')
      ) {
        return errorResponse('Too many requests', 'rate_limit', 429);
      }

      // Timeout error
      if (
        error.message.includes('timeout') ||
        error.message.includes('ETIMEDOUT')
      ) {
        return errorResponse('Request timed out', 'timeout', 504);
      }
    }

    // Generic error response (Requirements: 5.3)
    return errorResponse('Failed to generate response', 'ai_error', 500);
  }
}
