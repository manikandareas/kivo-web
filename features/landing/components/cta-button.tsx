'use client';

import { motion } from 'motion/react';
import type { CTAButtonProps } from '../types';

export function CTAButton({ onClick, children }: CTAButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className="rounded border border-border bg-transparent px-6 py-3 text-foreground transition-colors hover:bg-muted"
      data-testid="cta-button"
    >
      {children}
    </motion.button>
  );
}
