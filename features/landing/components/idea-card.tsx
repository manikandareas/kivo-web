'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import type { IdeaCardProps } from '../types';

export function IdeaCard({ idea, onClick }: IdeaCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex w-full flex-col overflow-hidden rounded-2xl bg-card text-left shadow-sm transition-shadow hover:shadow-lg"
      data-testid="idea-card"
    >
      {/* Thumbnail with overlay */}
      <div className="relative aspect-4/3 w-full overflow-hidden">
        {idea.thumbnail ? (
          <Image
            src={idea.thumbnail}
            alt={idea.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 200px, 280px"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-emerald-400 via-teal-500 to-amber-300" />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          {/* Overlay text */}
          <div className="space-y-1">
            {idea.overlayTitle && (
              <h4 className="text-lg font-semibold leading-tight text-white drop-shadow-md">
                {idea.overlayTitle}
              </h4>
            )}
            {idea.overlaySubtitle && (
              <p className="text-xs text-white/80">{idea.overlaySubtitle}</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom content */}
      <div className="flex flex-col gap-2 p-4">
        {idea.category && (
          <span className="text-sm font-medium text-primary">
            {idea.category}
          </span>
        )}
        <h3
          className="line-clamp-2 font-semibold leading-snug text-card-foreground"
          data-testid="idea-card-title"
        >
          {idea.title}
        </h3>
        {idea.author && (
          <p className="text-sm text-muted-foreground">By {idea.author}</p>
        )}
      </div>
    </motion.button>
  );
}
