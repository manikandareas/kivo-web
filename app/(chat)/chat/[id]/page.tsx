'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Chat } from '@/features/chat/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import type { ChatMessage, VisibilityType } from '@/features/chat/types';

/**
 * Chat detail page
 * Handles both new chats (from home page redirect) and existing chats
 *
 * Flow:
 * 1. Check sessionStorage for initial message (from home page)
 * 2. If found, start new chat with that message
 * 3. If not found, try to load existing chat from API
 */
export default function ChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [initialMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewChat, setIsNewChat] = useState(false);

  useEffect(() => {
    async function initializeChat() {
      setIsLoading(true);

      // Check for initial message from home page redirect
      const storageKey = `chat-initial-${chatId}`;
      const storedData = sessionStorage.getItem(storageKey);

      if (storedData) {
        try {
          const { content, timestamp } = JSON.parse(storedData);

          // Only use if less than 5 minutes old
          if (Date.now() - timestamp < 5 * 60 * 1000) {
            setInitialPrompt(content);
            setIsNewChat(true);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse stored chat data:', e);
        }

        // Clean up expired/invalid data
        sessionStorage.removeItem(storageKey);
      }

      // TODO: Load existing chat from API
      // For now, treat as new chat if no stored data
      // const response = await fetch(`/api/chat/${chatId}`);
      // if (response.ok) {
      //   const data = await response.json();
      //   setInitialMessages(data.messages);
      // }

      setIsNewChat(true);
      setIsLoading(false);
    }

    initializeChat();
  }, [chatId]);

  // Clear sessionStorage after initial prompt is sent
  const handleInitialPromptSent = useCallback(() => {
    sessionStorage.removeItem(`chat-initial-${chatId}`);
  }, [chatId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Chat
        id={chatId}
        initialMessages={initialMessages}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType={'private' as VisibilityType}
        isReadonly={false}
        autoResume={!isNewChat}
        initialPrompt={initialPrompt ?? undefined}
        onInitialPromptSent={handleInitialPromptSent}
        className="flex-1"
      />
    </div>
  );
}
