'use client';

import {
  Message as AIMessage,
  MessageContent,
} from '@/features/shared/components/ai-elements/message';
import { Loader } from '@/features/shared/components/ai-elements/loader';
import { cn } from '@/lib/utils';
import { BotIcon } from 'lucide-react';

/**
 * ThinkingMessage component
 * Displays a loading indicator when AI is processing
 * Uses AI Elements Loader component
 *
 * Requirements: 5.1, 5.3
 */
export function ThinkingMessage() {
  return (
    <AIMessage from="assistant">
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
      <MessageContent>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader size={16} />
          <span className="text-sm">Thinking...</span>
        </div>
      </MessageContent>
    </AIMessage>
  );
}
