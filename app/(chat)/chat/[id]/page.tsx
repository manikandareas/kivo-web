'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Chat } from '@/features/chat/components/chat';
import { BmcBento } from '@/features/chat/components/bmc-bento';
import { DEFAULT_CHAT_MODEL } from '@/lib/ai/models';
import type {
  ChatMessage,
  VisibilityType,
  BmcChatItem,
} from '@/features/chat/types';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Button } from '@/features/shared/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Chat detail page
 * Handles both new chats (from home page redirect) and existing chats
 */
export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const chatId = params.id as string;

  const [initialPrompt, setInitialPrompt] = useState<string | null>(null);
  const [initialMessages, setInitialMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewChat, setIsNewChat] = useState(false);

  // BMC state
  const [bmcItems, setBmcItems] = useState<BmcChatItem[] | null>(null);
  const [isBmcLoading, setIsBmcLoading] = useState(false);

  const { getToken } = useAuth();

  // Fetch BMC data for this chat
  const fetchBmcData = useCallback(async () => {
    setIsBmcLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/bmc/chat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data?.items) {
          setBmcItems(result.data.items);
        } else {
          setBmcItems(null);
        }
      } else {
        // 404 or other error - no BMC data
        setBmcItems(null);
      }
    } catch (e) {
      console.error('Failed to fetch BMC data:', e);
      setBmcItems(null);
    } finally {
      setIsBmcLoading(false);
    }
  }, [chatId]);

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

      // Load existing chat from API
      try {
        const response = await fetch(`${API_URL}/api/chat/${chatId}/messages`, {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data.length > 0) {
            setInitialMessages(result.data);
            setIsNewChat(false);
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error('Failed to load chat messages:', e);
      }

      setIsNewChat(true);
      setIsLoading(false);
    }

    initializeChat();
    // Also fetch BMC data on initial load
    fetchBmcData();
  }, [chatId, fetchBmcData, getToken]);

  // Clear sessionStorage after initial prompt is sent
  const handleInitialPromptSent = useCallback(() => {
    sessionStorage.removeItem(`chat-initial-${chatId}`);
  }, [chatId]);

  // Refetch BMC data when chat finishes
  const handleChatFinish = useCallback(() => {
    fetchBmcData();
  }, [fetchBmcData]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Link href="/">
            <Image
              src="/logo.svg"
              width={80}
              height={32}
              alt="Kivo"
              className="h-6 w-auto"
            />
          </Link>
        </div>
        <UserButton />
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Chat */}
        <div className="flex w-1/2 flex-col border-r">
          <Chat
            id={chatId}
            initialMessages={initialMessages}
            initialChatModel={DEFAULT_CHAT_MODEL}
            initialVisibilityType={'private' as VisibilityType}
            isReadonly={false}
            autoResume={!isNewChat}
            initialPrompt={initialPrompt ?? undefined}
            onInitialPromptSent={handleInitialPromptSent}
            onChatFinish={handleChatFinish}
            className="flex-1"
          />
        </div>

        {/* Right Section - BMC Bento */}
        <div className="w-1/2 overflow-y-auto bg-muted/30 scrollbar-thin">
          {isBmcLoading ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-sm text-muted-foreground">
                Loading BMC data...
              </div>
            </div>
          ) : bmcItems && bmcItems.length > 0 ? (
            <BmcBento items={bmcItems} />
          ) : (
            <div className="flex h-full items-center justify-center p-8">
              <div className="text-center">
                <div className="mb-2 text-4xl">📊</div>
                <p className="text-sm text-muted-foreground">
                  Business Model Canvas akan muncul di sini setelah AI
                  menganalisis ide bisnis Anda.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
