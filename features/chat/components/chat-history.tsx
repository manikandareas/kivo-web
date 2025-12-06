'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authClient } from '@/lib/auth-client';
import { useSession } from '@clerk/nextjs';

interface ChatItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatHistoryProps {
  className?: string;
}

export function ChatHistory({ className }: ChatHistoryProps) {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useSession();
  const [chats, setChats] = useState<ChatItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) {
      setIsLoading(false);
      return;
    }

    const fetchChats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/chat`,
          {
            credentials: 'include',
          }
        );
        const result = await response.json();

        if (result.success) {
          setChats(result.data);
        } else {
          setError(result.message || 'Gagal memuat riwayat obrolan');
        }
      } catch {
        setError('Gagal memuat riwayat obrolan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChats();
  }, [isSignedIn]);

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    if (diffInDays < 7) return `${diffInDays} hari lalu`;
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
  };

  // Don't render anything if not authenticated
  if (!isSignedIn && isLoaded) {
    return null;
  }

  if (isLoading || !isLoaded) {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          'py-4 text-center text-sm text-muted-foreground',
          className
        )}
      >
        {error}
      </div>
    );
  }

  if (chats.length === 0) {
    return (
      <div
        className={cn(
          'py-4 text-center text-sm text-muted-foreground',
          className
        )}
      >
        Belum ada riwayat obrolan
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Clock className="h-4 w-4" />
        <span>Riwayat Obrolan</span>
      </div>
      <div className="flex flex-col gap-2">
        {chats.slice(0, 5).map((chat) => (
          <button
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
            className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-primary hover:bg-primary/10"
          >
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground group-hover:text-foreground">
                {chat.title}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground group-hover:text-foreground/70">
                {formatRelativeTime(chat.updatedAt)}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
