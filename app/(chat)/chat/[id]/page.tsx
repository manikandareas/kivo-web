'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { Chat } from '@/features/chat/components/chat';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import type {
  Chat as ChatType,
  ChatMessage,
  VisibilityType,
} from '@/features/chat/types';

/**
 * Chat data with messages
 */
interface ChatData extends ChatType {
  messages: ChatMessage[];
}

/**
 * Fetch chat data by ID
 * In a real implementation, this would call an API endpoint
 */
async function fetchChatById(id: string): Promise<ChatData | null> {
  // TODO: Replace with actual API call
  // For now, return null to simulate not found
  // In production, this would fetch from your backend
  console.log('Fetching chat:', id);

  // Simulated API response structure
  // const response = await fetch(`/api/chat/${id}`);
  // if (!response.ok) return null;
  // return response.json();

  return null;
}

/**
 * Get current user ID from session
 * In a real implementation, this would use auth context
 */
function getCurrentUserId(): string | null {
  // TODO: Replace with actual auth implementation
  // const session = useSession();
  // return session?.user?.id ?? null;
  return null;
}

/**
 * Check if user has access to the chat
 */
function hasAccess(chat: ChatData, currentUserId: string | null): boolean {
  // Public chats are accessible to everyone
  if (chat.visibility === 'public') {
    return true;
  }

  // Private chats require matching user ID
  if (!currentUserId) {
    return false;
  }

  return chat.userId === currentUserId;
}

/**
 * Existing chat page
 * Fetches chat data by ID from URL params
 * Handles not found case
 * Loads and displays previous messages
 * Implements authorization check
 *
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
 */
export default function ExistingChatPage() {
  const params = useParams();
  const chatId = params.id as string;

  const [chatData, setChatData] = useState<ChatData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAccessToChat, setHasAccessToChat] = useState(true);

  useEffect(() => {
    async function loadChat() {
      setIsLoading(true);

      try {
        const data = await fetchChatById(chatId);

        if (!data) {
          // Chat not found
          setChatData(null);
          setIsLoading(false);
          return;
        }

        // Check authorization
        const currentUserId = getCurrentUserId();
        if (!hasAccess(data, currentUserId)) {
          // User doesn't have access - show not found for security
          setHasAccessToChat(false);
          setChatData(null);
          setIsLoading(false);
          return;
        }

        setChatData(data);
      } catch (error) {
        console.error('Failed to load chat:', error);
        setChatData(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadChat();
  }, [chatId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading chat...</div>
      </div>
    );
  }

  // Handle not found or unauthorized (security through obscurity)
  if (!chatData || !hasAccessToChat) {
    notFound();
  }

  // Determine if chat is readonly (for public chats viewed by non-owners)
  const currentUserId = getCurrentUserId();
  const isReadonly =
    chatData.visibility === 'public' && chatData.userId !== currentUserId;

  return (
    <div className="flex h-screen flex-col">
      <Chat
        id={chatData.id}
        initialMessages={chatData.messages}
        initialChatModel={DEFAULT_CHAT_MODEL}
        initialVisibilityType={chatData.visibility as VisibilityType}
        isReadonly={isReadonly}
        autoResume={true}
        className="flex-1"
      />
    </div>
  );
}
