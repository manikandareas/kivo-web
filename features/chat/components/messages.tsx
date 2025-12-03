'use client';

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation';
import { memo, useEffect, useRef } from 'react';
import type { ChatMessageWithParts } from '../types';
import { Message } from './message';
import { ThinkingMessage } from './thinking-message';

/**
 * Chat status type matching Vercel AI SDK useChat status
 */
export type ChatStatus = 'submitted' | 'streaming' | 'ready' | 'error';

export interface MessagesProps {
  chatId: string;
  status: ChatStatus;
  messages: ChatMessageWithParts[];
  setMessages: (messages: ChatMessageWithParts[]) => void;
  regenerate: () => void;
  isReadonly: boolean;
}

/**
 * Messages component
 * Displays a list of chat messages with scroll management
 * Uses AI Elements Conversation component as container
 *
 * Requirements: 3.1, 3.4, 3.5, 4.2
 */
function PureMessages({
  chatId: _chatId,
  status,
  messages,
  isReadonly,
}: MessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // chatId is used in memo comparison to trigger re-render on chat change
  void _chatId;

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const isLoading = status === 'streaming';
  const isSubmitted = status === 'submitted';

  return (
    <Conversation className="flex-1">
      <ConversationContent>
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            isLoading={
              isLoading &&
              index === messages.length - 1 &&
              message.role === 'assistant'
            }
            isLastMessage={index === messages.length - 1}
            isReadonly={isReadonly}
          />
        ))}

        {isSubmitted && <ThinkingMessage />}

        <div ref={messagesEndRef} />
      </ConversationContent>

      <ConversationScrollButton />
    </Conversation>
  );
}

export const Messages = memo(PureMessages, (prevProps, nextProps) => {
  if (prevProps.chatId !== nextProps.chatId) return false;
  if (prevProps.status !== nextProps.status) return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;
  if (prevProps.messages.length !== nextProps.messages.length) return false;

  // Check if any message parts changed
  for (let i = 0; i < prevProps.messages.length; i++) {
    if (prevProps.messages[i].id !== nextProps.messages[i].id) return false;
    if (
      prevProps.messages[i].parts.length !== nextProps.messages[i].parts.length
    )
      return false;
    // Check parts content
    for (let j = 0; j < prevProps.messages[i].parts.length; j++) {
      const prevPart = prevProps.messages[i].parts[j];
      const nextPart = nextProps.messages[i].parts[j];
      if (prevPart.type !== nextPart.type) return false;
      if ('text' in prevPart && 'text' in nextPart) {
        if (prevPart.text !== nextPart.text) return false;
      }
    }
  }

  return true;
});

Messages.displayName = 'Messages';
