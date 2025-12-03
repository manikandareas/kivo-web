'use client';

import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import type { ChatInputProps } from '../types';
import { Button } from '@/features/shared';

export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Ketik ide atau pesan kamu...',
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={5}
        className="w-full resize-none rounded border border-border bg-input p-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        data-testid="chat-input-textarea"
      />
      <Button
        type="button"
        onClick={onSend}
        className="absolute bottom-3 right-3"
        data-testid="chat-input-send-button"
        aria-label="Send message"
        size={'sm'}
      >
        <motion.span whileHover={{ rotate: 15 }}>
          <Send className="size-3" />
        </motion.span>
      </Button>
    </div>
  );
}
