'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';
import { motion, AnimatePresence, Transition } from 'framer-motion';
import { Button } from '@/features/shared/components/ui/button';
import { cn } from '@/lib/utils';

interface FloatingGlobeButtonProps {
  onClick?: () => void;
}

const springTransition = {
  type: 'spring',
  stiffness: 400,
  damping: 25,
  mass: 0.8,
};

const smoothTransition = {
  duration: 0.4,
  ease: [0.25, 0.46, 0.45, 0.94], // easeOutQuad for smoother feel
};

export function FloatingGlobeButton({ onClick }: FloatingGlobeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        initial={{ width: 56, y: 0 }}
        animate={{
          width: isHovered ? 'auto' : 56,
          y: isHovered ? -4 : 0,
        }}
        transition={springTransition as Transition}
        whileTap={{ scale: 0.92 }}
      >
        <Button
          onClick={onClick}
          variant="outline"
          className={cn(
            'relative flex items-center gap-3 rounded-full overflow-hidden h-14 px-4',
            'shadow-lg hover:shadow-xl transition-shadow duration-300',
            'backdrop-blur-sm bg-background/95',
            !isHovered && 'w-14 px-0 justify-center'
          )}
        >
          <motion.div
            animate={{
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{
              rotate: {
                duration: 0.8,
                ease: [0.34, 1.56, 0.64, 1], // custom spring-like easing
              },
              scale: springTransition as Transition,
            }}
          >
            <Globe className="size-6 shrink-0 text-muted-foreground" />
          </motion.div>

          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.span
                initial={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: -10, filter: 'blur(4px)' }}
                transition={smoothTransition as unknown as Transition}
                className="whitespace-nowrap font-semibold pr-1"
              >
                Jelajahi sekarang
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}
