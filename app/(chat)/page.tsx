'use client';

import { BmcTimeline, ExploreMap } from '@/features/explore';
import { Header } from '@/features/landing';
import {
  HomeChatForm,
  ChatHistory,
  LocationPermissionModal,
  useGeolocation,
} from '@/features/chat';
import {
  Suggestion,
  Suggestions,
} from '@/features/shared/components/ai-elements/suggestion';
import { cn } from '@/lib/utils';
import { Map, MessageSquare } from 'lucide-react';
import { Suspense, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { generateUUID } from '@/lib/utils';
import { useSession } from '@clerk/nextjs';

export default function Home() {
  const router = useRouter();
  const { isSignedIn } = useSession();
  const [activeTab, setActiveTab] = useState<'chat' | 'explore'>('chat');
  const {
    shouldShowModal,
    getCurrentPosition,
    markAsAsked,
    isLoading: isLocationLoading,
  } = useGeolocation();

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

  const handleAllowLocation = useCallback(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  const handleSkipLocation = useCallback(() => {
    markAsAsked();
  }, [markAsAsked]);

  return (
    <div className="flex h-dvh flex-col bg-background md:h-screen">
      {/* Location Permission Modal */}
      <LocationPermissionModal
        open={shouldShowModal && isSignedIn === true}
        onAllow={handleAllowLocation}
        onSkip={handleSkipLocation}
        isLoading={isLocationLoading}
      />

      {/* Mobile Tab Switcher */}
      <div className="flex shrink-0 border-b border-border md:hidden">
        <button
          onClick={() => setActiveTab('chat')}
          className={cn(
            'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors active:bg-muted/50',
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
            'flex flex-1 items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors active:bg-muted/50',
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
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Left Section - Chat */}
        <div
          className={cn(
            'relative flex h-full flex-col',
            'md:w-1/2 md:border-r md:border-border',
            activeTab === 'chat' ? 'flex w-full' : 'hidden md:flex'
          )}
        >
          <Header />
          <div className="flex flex-1 flex-col items-center overflow-y-auto overflow-x-hidden px-4 py-6 md:justify-center md:overflow-hidden md:p-6">
            <div className="w-full max-w-2xl shrink-0 text-center">
              <h1 className="mb-2 text-xl font-bold text-foreground md:text-3xl lg:text-4xl">
                Kembangkan
                <span className="relative mx-0.5 cursor-pointer rounded-sm px-1 underline decoration-primary/80 decoration-wavy decoration-2 underline-offset-[3px] transition-colors hover:bg-primary/20 hover:decoration-primary">
                  Ide mu
                </span>
              </h1>
              <p className="mx-auto max-w-[300px] text-sm text-muted-foreground md:max-w-md">
                Mulai percakapan dengan AI untuk mengembangkan dan memvalidasi
                ide bisnis Anda
              </p>
            </div>

            <HomeChatForm className="mt-6 w-full max-w-2xl shrink-0" />

            <div className="-mx-4 mt-5 w-[calc(100%+2rem)] max-w-none shrink-0 px-4 md:mx-0 md:mt-4 md:w-full md:max-w-2xl md:px-0">
              <Suggestions className="pb-2">
                <Suggestion
                  key="buildIdea"
                  onClick={
                    isSignedIn
                      ? () =>
                          handleSuggestionClick(
                            'Bantu aku membangun ide bisnis'
                          )
                      : undefined
                  }
                  suggestion="Belum punya ide 😪"
                  disabled={!isSignedIn}
                  className="px-3 text-xs md:px-4 md:text-sm"
                />
                <Suggestion
                  key="analyzeMarket"
                  onClick={
                    isSignedIn
                      ? () =>
                          handleSuggestionClick(
                            'Analisis peluang bisnis di industri teknologi saat ini'
                          )
                      : undefined
                  }
                  suggestion="Analisis peluang pasar 🎯"
                  disabled={!isSignedIn}
                  className="px-3 text-xs md:px-4 md:text-sm"
                />
                <Suggestion
                  key="validateIdea"
                  onClick={
                    isSignedIn
                      ? () =>
                          handleSuggestionClick(
                            'Bantu validasi ide bisnis saya'
                          )
                      : undefined
                  }
                  suggestion="Validasi ide bisnis 🚀"
                  disabled={!isSignedIn}
                  className="px-3 text-xs md:px-4 md:text-sm"
                />
              </Suggestions>
            </div>

            <ChatHistory className="mt-8 w-full max-w-2xl" />
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
            <div className="absolute bottom-3 left-3 right-3 z-10 md:bottom-4 md:left-4 md:right-auto md:w-80 lg:w-96">
              <BmcTimeline className="max-h-[30vh] md:max-h-[40vh]" />
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
