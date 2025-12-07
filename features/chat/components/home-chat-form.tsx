'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateUUID, cn } from '@/lib/utils';
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from '@/features/shared/components/ai-elements/prompt-input';
import { Lock } from 'lucide-react';
import { useSession } from '@clerk/nextjs';

export interface HomeChatFormProps {
  className?: string;
}

/**
 * Home page chat form component
 * Submits initial message to /api/v1/chat without chatId
 * Gets chatId from response and redirects to /chat/:chatId
 */
export function HomeChatForm({ className }: HomeChatFormProps) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useSession();
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
    <div className={cn('relative', className)}>
      <PromptInput
        onSubmit={handleSubmit}
        className={cn('mx-auto max-w-2xl', !isSignedIn && 'opacity-50')}
      >
        <PromptInputTextarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ceritakan ide bisnis Anda..."
          disabled={isSubmitting || !isSignedIn}
          aria-label="Chat message input"
        />

        <PromptInputFooter>
          <PromptInputTools />
          <PromptInputTools>
            <PromptInputSubmit
              disabled={isSubmitting || !input.trim() || !isSignedIn}
              status={isSubmitting ? 'submitted' : 'ready'}
              aria-label="Send message"
            />
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>

      {/* Overlay for unauthenticated users */}
      {!isSignedIn && isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2 text-center">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium text-muted-foreground">
              Masuk terlebih dahulu untuk mengakses fitur
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
