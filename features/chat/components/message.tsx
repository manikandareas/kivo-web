'use client';

import {
  Message as AIMessage,
  MessageContent,
  MessageResponse,
} from '@/features/shared/components/ai-elements/message';
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/features/shared/components/ai-elements/reasoning';
import { cn } from '@/lib/utils';
import { BotIcon } from 'lucide-react';
import { memo } from 'react';
import type { ChatMessageWithParts } from '../types';

export interface MessageProps {
  message: ChatMessageWithParts;
  isLoading?: boolean;
  isReadonly?: boolean;
  isLastMessage?: boolean;
}

/**
 * Chat Message wrapper component
 * Uses AI Elements Message component as base
 * Implements user message styling (right-aligned, blue background)
 * Implements assistant message styling (left-aligned, with icon)
 * Supports streaming content display and reasoning parts
 *
 * Requirements: 3.2, 3.3, 5.2
 */
function PureMessage({
  message,
  isLoading = false,
  isLastMessage = false,
}: MessageProps) {
  const { role, parts } = message;

  return (
    <AIMessage from={role}>
      {role === 'assistant' && (
        <div className="flex items-center gap-2">
          <div
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-full',
              'bg-primary/10 text-primary'
            )}
          >
            <BotIcon className="size-4" />
          </div>
        </div>
      )}
      <MessageContent
        className={cn(
          role === 'user' &&
            'bg-primary text-primary-foreground group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground'
        )}
      >
        {role === 'assistant' ? (
          <>
            {parts.map((part, index) => {
              if (part.type === 'reasoning') {
                return (
                  <Reasoning
                    key={`${message.id}-reasoning-${index}`}
                    className="w-full"
                    isStreaming={
                      isLoading && isLastMessage && index === parts.length - 1
                    }
                  >
                    <ReasoningTrigger />
                    <ReasoningContent>{part.text}</ReasoningContent>
                  </Reasoning>
                );
              }
              if (part.type === 'text') {
                return (
                  <MessageResponse key={`${message.id}-text-${index}`}>
                    {part.text}
                  </MessageResponse>
                );
              }
              return null;
            })}
            {isLoading && (
              <span className="inline-block h-4 w-1 animate-pulse bg-current" />
            )}
          </>
        ) : (
          <span className="whitespace-pre-wrap">
            {parts
              .filter((p) => p.type === 'text')
              .map((p) => p.text)
              .join('')}
          </span>
        )}
      </MessageContent>
    </AIMessage>
  );
}

export const Message = memo(PureMessage, (prevProps, nextProps) => {
  if (prevProps.isLoading !== nextProps.isLoading) return false;
  if (prevProps.isLastMessage !== nextProps.isLastMessage) return false;
  if (prevProps.message.id !== nextProps.message.id) return false;
  if (prevProps.message.role !== nextProps.message.role) return false;
  if (prevProps.message.parts.length !== nextProps.message.parts.length)
    return false;
  // Check if any part content changed
  for (let i = 0; i < prevProps.message.parts.length; i++) {
    const prevPart = prevProps.message.parts[i];
    const nextPart = nextProps.message.parts[i];
    if (prevPart.type !== nextPart.type) return false;
    if ('text' in prevPart && 'text' in nextPart) {
      if (prevPart.text !== nextPart.text) return false;
    }
  }
  return true;
});

Message.displayName = 'Message';
