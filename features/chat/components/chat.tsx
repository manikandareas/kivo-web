'use client';

import { useChat, type UIMessage } from '@ai-sdk/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { memo, useCallback, useState, useRef, useEffect, useMemo } from 'react';
import type {
  ChatMessage,
  ChatMessageWithParts,
  MessagePart,
  VisibilityType,
} from '../types';
import { Messages, type ChatStatus } from './messages';
import { ChatInput } from './chat-input';
import { DefaultChatTransport } from 'ai';
import { useGeolocation } from '../hooks';
import { useAuth } from '@clerk/nextjs';

export interface ChatProps {
  id: string;
  initialMessages?: ChatMessage[];
  initialChatModel?: string;
  initialVisibilityType?: VisibilityType;
  isReadonly?: boolean;
  autoResume?: boolean;
  className?: string;
  /** Initial message to send automatically (from home page redirect) */
  initialPrompt?: string;
  /** Callback when initial prompt has been sent */
  onInitialPromptSent?: () => void;
  /** Callback when chat stream finishes */
  onChatFinish?: () => void;
}

/**
 * Convert UIMessage parts to ChatMessageWithParts format
 */
type ChatMessageWithMeta = UIMessage<{ chatId?: string; isNewChat?: boolean }>;

function convertToChatMessageWithParts(
  msg: ChatMessageWithMeta
): ChatMessageWithParts {
  const parts: MessagePart[] = [];

  for (const part of msg.parts) {
    if (part.type === 'text') {
      parts.push({ type: 'text', text: part.text });
    } else if (part.type === 'reasoning') {
      parts.push({ type: 'reasoning', text: part.text });
    }
  }

  return {
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    parts: parts.length > 0 ? parts : [{ type: 'text', text: '' }],
  };
}

/**
 * Convert ChatMessage to UIMessage format
 */
function toUIMessage(msg: ChatMessage): ChatMessageWithMeta {
  return {
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    parts: [{ type: 'text', text: msg.content }],
  };
}

/**
 * Error type detection utilities
 */
function isNetworkError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('network') ||
    message.includes('fetch') ||
    message.includes('connection') ||
    message.includes('timeout') ||
    error.name === 'TypeError'
  );
}

function isSessionExpiredError(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes('unauthorized') ||
    message.includes('401') ||
    message.includes('session') ||
    message.includes('authentication')
  );
}

/**
 * Main Chat component
 * Orchestrates the entire chat experience using Vercel AI SDK
 * Composes Messages and ChatInput components
 * Handles submit, stop, and regenerate actions
 *
 * Requirements: 1.2, 2.2, 2.3, 2.4, 6.2, 7.1, 7.2, 7.3, 8.1, 8.3
 */
function PureChat({
  id,
  initialMessages = [],
  initialChatModel: _initialChatModel,
  initialVisibilityType: _initialVisibilityType,
  isReadonly = false,
  className,
  initialPrompt,
  onInitialPromptSent,
  onChatFinish,
}: ChatProps) {
  // These props are used for initialization but not directly in render
  void _initialChatModel;
  void _initialVisibilityType;

  const router = useRouter();

  const { coordinates } = useGeolocation();

  const { getToken } = useAuth();

  // Local input state for controlled input
  const [input, setInput] = useState('');

  // Track last failed message for retry functionality (Requirement 7.2)
  const lastFailedMessageRef = useRef<{ content: string } | null>(null);

  // Ref to store sendMessage function for use in error handler
  const sendMessageRef = useRef<
    | ((message: {
        role: 'user';
        parts: { type: 'text'; text: string }[];
      }) => void)
    | null
  >(null);

  /**
   * Retry the last failed message
   * Used by error handler for network errors (Requirement 7.2)
   */
  const retryLastMessage = useCallback(() => {
    if (lastFailedMessageRef.current && sendMessageRef.current && !isReadonly) {
      sendMessageRef.current({
        role: 'user',
        parts: [{ type: 'text', text: lastFailedMessageRef.current.content }],
      });
    }
  }, [isReadonly]);

  /**
   * Handle errors from useChat hook
   * Requirements: 7.1, 7.2, 7.3
   */
  const handleError = useCallback(
    (error: Error) => {
      // Requirement 7.3: Handle session expiration with redirect
      if (isSessionExpiredError(error)) {
        toast.error('Session expired. Redirecting to login...');
        router.push('/sign-in');
        return;
      }

      // Requirement 7.2: Handle network errors with retry option
      if (isNetworkError(error)) {
        toast.error(
          (t) => (
            <div className="flex flex-col gap-2">
              <span>Network error. Please check your connection.</span>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  retryLastMessage();
                }}
                className="rounded bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90"
              >
                Retry
              </button>
            </div>
          ),
          { duration: 10000 }
        );
        return;
      }

      // Requirement 7.1: Handle API errors with toast notifications
      toast.error(error.message || 'An error occurred while sending message');
    },
    [router, retryLastMessage]
  );

  // Memoize transport to update when coordinates change
  const chatTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat/${id}`,
        headers: async () => {
          const token = await getToken();
          return {
            Authorization: `Bearer ${token}`,
          };
        },
        body: {
          location: coordinates
            ? {
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                accuracy: coordinates.accuracy,
              }
            : null,
        },
      }),
    [id, coordinates, getToken]
  );

  const { messages, setMessages, status, stop, regenerate, sendMessage } =
    useChat<ChatMessageWithMeta>({
      id,
      messages: initialMessages.map(toUIMessage),
      resume: false,
      onError: handleError,
      onFinish: ({ message }) => {
        const meta = message.metadata;
        if (meta?.chatId && meta?.isNewChat && meta.chatId !== id) {
          router.replace(`/chat/${meta.chatId}`);
        }
        // Notify parent that chat finished
        onChatFinish?.();
      },
      transport: chatTransport,
    });

  // Keep sendMessageRef updated with latest sendMessage function
  useEffect(() => {
    sendMessageRef.current = sendMessage;
  }, [sendMessage]);

  // Track if initial prompt has been sent
  const initialPromptSentRef = useRef(false);

  // Auto-send initial prompt when provided (from home page redirect)
  useEffect(() => {
    if (
      initialPrompt &&
      !initialPromptSentRef.current &&
      !isReadonly &&
      status === 'ready'
    ) {
      initialPromptSentRef.current = true;

      // Send the initial message
      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: initialPrompt }],
      });

      // Notify parent that initial prompt was sent
      onInitialPromptSent?.();
    }
  }, [initialPrompt, isReadonly, status, sendMessage, onInitialPromptSent]);

  // Convert AI SDK UIMessage to ChatMessageWithParts format (preserves reasoning)
  const chatMessages: ChatMessageWithParts[] = messages.map(
    convertToChatMessageWithParts
  );

  // Handle message submission
  const handleSendMessage = useCallback(
    (message: { content: string }) => {
      if (isReadonly) return;

      // Store message for potential retry (Requirement 7.2)
      lastFailedMessageRef.current = message;

      sendMessage({
        role: 'user',
        parts: [{ type: 'text', text: message.content }],
      });
      setInput('');
    },
    [sendMessage, isReadonly]
  );

  // Handle regenerate (reload last assistant message)
  const handleRegenerate = useCallback(() => {
    if (isReadonly) return;
    regenerate();
  }, [regenerate, isReadonly]);

  // Handle setting messages (for external updates)
  const handleSetMessages = useCallback(
    (newMessages: ChatMessageWithParts[]) => {
      setMessages(
        newMessages.map((msg) => ({
          id: msg.id,
          role: msg.role as 'user' | 'assistant',
          parts: msg.parts.map((p) =>
            p.type === 'text'
              ? { type: 'text' as const, text: p.text }
              : p.type === 'reasoning'
                ? { type: 'reasoning' as const, text: p.text }
                : { type: 'text' as const, text: '' }
          ),
        }))
      );
    },
    [setMessages]
  );

  return (
    <div
      className={cn(
        'flex h-full flex-col',
        'mx-auto w-full max-w-4xl',
        className
      )}
    >
      <Messages
        chatId={id}
        status={status as ChatStatus}
        messages={chatMessages}
        setMessages={handleSetMessages}
        regenerate={handleRegenerate}
        isReadonly={isReadonly}
      />

      {!isReadonly && (
        <ChatInput
          chatId={id}
          input={input}
          setInput={setInput}
          status={status}
          stop={stop}
          sendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}

export const Chat = memo(PureChat, (prevProps, nextProps) => {
  if (prevProps.id !== nextProps.id) return false;
  if (prevProps.isReadonly !== nextProps.isReadonly) return false;
  if (prevProps.className !== nextProps.className) return false;
  // initialMessages comparison - only compare on mount
  if (prevProps.initialMessages?.length !== nextProps.initialMessages?.length) {
    return false;
  }
  return true;
});

Chat.displayName = 'Chat';
