'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from '@/features/shared/components/ai-elements/prompt-input';

export interface HomeChatFormProps {
  className?: string;
}

/**
 * Home page chat form component
 * Submits initial message to /api/chat without chatId
 * Gets chatId from response and redirects to /chat/:chatId
 */
export function HomeChatForm({ className }: HomeChatFormProps) {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(
    async (message: { text: string }) => {
      const trimmedText = message.text.trim();
      if (!trimmedText || isSubmitting) return;

      setIsSubmitting(true);

      try {
        // Generate chatId for new conversation
        const chatId = generateUUID();

        // Store initial message in sessionStorage for chat page to pick up
        sessionStorage.setItem(
          `chat-initial-${chatId}`,
          JSON.stringify({
            content: trimmedText,
            timestamp: Date.now(),
          })
        );

        // Redirect to chat page with the new chatId
        router.push(`/chat/${chatId}`);
      } catch (error) {
        console.error('Failed to start chat:', error);
        setIsSubmitting(false);
      }
    },
    [router, isSubmitting]
  );

  return (
    <div className={className}>
      <PromptInput onSubmit={handleSubmit} className="mx-auto max-w-2xl">
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ceritakan ide bisnis Anda..."
          disabled={isSubmitting}
          aria-label="Chat message input"
        />

        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputTools>
            <PromptInputSubmit
              disabled={isSubmitting || !input.trim()}
              status={isSubmitting ? 'submitted' : 'ready'}
              aria-label="Send message"
            />
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}
