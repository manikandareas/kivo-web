'use client';

import { Send } from 'lucide-react';
import { motion } from 'motion/react';
import type { ChatInputProps } from '../types';

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
        className="w-full resize-none rounded-[var(--radius)] border border-border bg-input p-4 pr-14 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        data-testid="chat-input-textarea"
      />
      <motion.button
        type="button"
        onClick={onSend}
        whileHover={{ scale: 1.05 }}
        className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground transition-colors hover:bg-primary/90"
        data-testid="chat-input-send-button"
        aria-label="Send message"
      >
        <motion.span whileHover={{ rotate: 15 }}>
          <Send className="h-5 w-5" />
        </motion.span>
      </motion.button>
    </div>
  );
}
