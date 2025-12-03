'use client';

import { motion } from 'motion/react';

export function GradientBlob() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Primary blob */}
      <motion.div
        className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-linear-to-br from-primary/30 via-primary/10 to-transparent blur-3xl"
        animate={{
          x: [0, 100, 50, 0],
          y: [0, 50, 100, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Accent blob */}
      <motion.div
        className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-linear-to-tl from-accent/25 via-accent/10 to-transparent blur-3xl"
        animate={{
          x: [0, -80, -40, 0],
          y: [0, -60, -120, 0],
          scale: [1, 0.8, 1.1, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
      />

      {/* Center subtle blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-linear-to-r from-chart-3/10 via-transparent to-chart-4/10 blur-3xl"
        animate={{
          rotate: [0, 360],
          scale: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </div>
  );
}
