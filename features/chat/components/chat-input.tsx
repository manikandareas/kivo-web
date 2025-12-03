'use client';

import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
  PromptInputButton,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input';
import { cn } from '@/lib/utils';
import type { ChatStatus } from 'ai';
import { SquareIcon } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

export interface ChatInputProps {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  status: ChatStatus;
  stop: () => void;
  sendMessage: (message: { content: string }) => void;
  className?: string;
  disabled?: boolean;
}

/**
 * ChatInput component
 * Uses AI Elements PromptInput component as base
 * Implements textarea with controlled input
 * Add submit button with send icon
 * Add stop button (visible during streaming)
 * Implements keyboard shortcuts (Enter to submit)
 *
 * Requirements: 2.1, 2.3, 5.4, 6.1
 */
function PureChatInput({
  chatId: _chatId,
  input,
  setInput,
  status,
  stop,
  sendMessage,
  className,
  disabled = false,
}: ChatInputProps) {
  // chatId is used for memo comparison
  void _chatId;

  const [localInput, setLocalInput] = useState(input);

  // Sync local input with external input
  const handleInputChange = useCallback(
    (value: string) => {
      setLocalInput(value);
      setInput(value);
    },
    [setInput]
  );

  const isStreaming = status === 'streaming';
  const isSubmitted = status === 'submitted';
  const isProcessing = isStreaming || isSubmitted;

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      const trimmedText = message.text.trim();

      // Prevent submission of empty or whitespace-only messages
      if (!trimmedText) {
        return;
      }

      sendMessage({ content: trimmedText });
      setLocalInput('');
      setInput('');
    },
    [sendMessage, setInput]
  );

  const handleStop = useCallback(() => {
    stop();
  }, [stop]);

  return (
    <div className={cn('sticky bottom-0 w-full bg-background pb-4', className)}>
      <PromptInput onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <PromptInputTextarea
          value={localInput}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Send a message..."
          disabled={disabled || isProcessing}
          aria-label="Chat message input"
        />

        <PromptInputFooter>
          <PromptInputTools>
            {/* Additional tools can be added here */}
          </PromptInputTools>

          <PromptInputTools>
            {isProcessing ? (
              <PromptInputButton
                onClick={handleStop}
                aria-label="Stop generating"
                variant="destructive"
              >
                <SquareIcon className="size-4" />
              </PromptInputButton>
            ) : (
              <PromptInputSubmit
                disabled={disabled || !localInput.trim()}
                status={status}
                aria-label="Send message"
              />
            )}
          </PromptInputTools>
        </PromptInputFooter>
      </PromptInput>
    </div>
  );
}

export const ChatInput = memo(PureChatInput, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.input !== nextProps.input) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.disabled !== nextProps.disabled) return false;
  return true;
});

ChatInput.displayName = 'ChatInput';
