'use client';

import { motion } from 'motion/react';

interface AnimatedBadgeProps {
  text: string;
  emoji?: string;
}

export function AnimatedBadge({ text, emoji = '✨' }: AnimatedBadgeProps) {
  return (
    <motion.div
      className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {emoji}
      </motion.span>
      <span className="font-medium">{text}</span>
    </motion.div>
  );
}
