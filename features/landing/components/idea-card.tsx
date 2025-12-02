'use client';

import { motion } from 'motion/react';
import type { IdeaCardProps } from '../types';

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex w-full flex-col items-start gap-2 rounded-[var(--radius)] border border-border bg-card p-4 text-left shadow-sm transition-shadow hover:shadow-md"
      data-testid="idea-card"
    >
      {idea.icon && (
        <span className="text-2xl" data-testid="idea-card-icon">
          {idea.icon}
        </span>
      )}
      <h3
        className="font-medium text-card-foreground"
        data-testid="idea-card-title"
      >
        {idea.title}
      </h3>
      {idea.description && (
        <p
          className="text-sm text-muted-foreground"
          data-testid="idea-card-description"
        >
          {idea.description}
        </p>
      )}
    </motion.button>
  );
}
