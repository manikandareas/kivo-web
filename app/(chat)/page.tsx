'use client';

import { BmcTimeline, ExploreMap } from '@/features/explore';
import { Header } from '@/features/landing';
import { HomeChatForm } from '@/features/chat/components/home-chat-form';
import {
  Suggestion,
  Suggestions,
} from '@/features/shared/components/ai-elements/suggestion';
import { cn } from '@/lib/utils';
import { Map, MessageSquare } from 'lucide-react';
import { Suspense, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chat' | 'explore'>('chat');

  // Handle suggestion click - redirect to chat with pre-filled message
  const handleSuggestionClick = useCallback(
    (message: string) => {
      const chatId = generateUUID();

      // Store message in sessionStorage for chat page
      sessionStorage.setItem(
        `chat-initial-${chatId}`,
        JSON.stringify({
          content: message,
          timestamp: Date.now(),
        })
      );

      router.push(`/chat/${chatId}`);
    },
    [router]
  );

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Mobile Tab Switcher */}
      <div className="flex border-b border-border md:hidden">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'chat'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Chat
        </button>
        <button
          onClick={() => setActiveTab('explore')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors',
            activeTab === 'explore'
              ? 'border-b-2 border-primary text-primary'
              : 'text-muted-foreground'
          )}
        >
          <Map className="h-4 w-4" />
          Explore
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Section - Chat */}
        <div
          className={cn(
            'relative flex h-full flex-col',
            'md:w-1/2 md:border-r md:border-border',
            activeTab === 'chat' ? 'flex w-full' : 'hidden md:flex'
          )}
        >
          <Header />
          <div className="flex flex-1 flex-col items-center justify-center overflow-hidden p-4 md:p-6">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
                Kembangkan
                <span className="relative mx-0.5 cursor-pointer rounded-sm px-1 underline decoration-primary/80 decoration-wavy decoration-2 underline-offset-[3px] transition-colors hover:bg-primary/20 hover:decoration-primary">
                  Ide mu
                </span>
              </h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Mulai percakapan dengan AI untuk mengembangkan dan memvalidasi
                ide bisnis Anda
              </p>
            </div>

            <HomeChatForm className="mt-6 w-full max-w-2xl" />

            <div className="mt-4">
              <Suggestions>
                <Suggestion
                  key="buildIdea"
                  onClick={() => setActiveTab('explore')}
                  suggestion="Belum punya ide 😪"
                />
                <Suggestion
                  key="analyzeMarket"
                  onClick={() =>
                    handleSuggestionClick(
                      'Analisis peluang bisnis di industri teknologi saat ini'
                    )
                  }
                  suggestion="Analisis peluang pasar 🎯"
                />
                <Suggestion
                  key="validateIdea"
                  onClick={() =>
                    handleSuggestionClick('Bantu validasi ide bisnis saya')
                  }
                  suggestion="Validasi ide bisnis 🚀"
                />
              </Suggestions>
            </div>
          </div>
        </div>

        {/* Right Section - Explorer */}
        <div
          className={cn(
            'relative flex-1',
            'md:w-1/2',
            activeTab === 'explore'
              ? 'flex w-full flex-col'
              : 'hidden md:flex md:flex-col'
          )}
        >
          <Suspense fallback={null}>
            <ExploreMap />
            <div className="absolute bottom-4 left-4 right-4 z-10 md:right-auto md:w-80 lg:w-96">
              <BmcTimeline className="max-h-[35vh] md:max-h-[40vh]" />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
