'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatInput } from './chat-input';
import type { HeroSectionProps } from '../types';
import { Button } from '@/features/shared/components/ui/button';
import { Suggestion, Suggestions } from '@/components/ai-elements/suggestion';
import { AnimatedBadge } from './animated-badge';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HeroSection({
  onSendMessage,
  onExploreClick,
}: HeroSectionProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <motion.section
      className="container flex min-h-[60vh] flex-col items-center justify-center py-16"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      data-testid="hero-section"
    >
      <motion.h1
        className="mb-12 text-center text-4xl font-bold text-foreground md:text-5xl lg:text-6xl font-(family-name:--font-fuzzy-bubbles)"
        variants={itemVariants}
      >
        Kembangkan Ide mu
      </motion.h1>

      <motion.div className="w-full max-w-2xl" variants={itemVariants}>
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
        />
      </motion.div>

      <motion.div
        className="mt-4 w-full max-w-2xl mx-auto"
        variants={itemVariants}
      >
        <Suggestions>
          <Suggestion
            key={'buildIdea'}
            onClick={onExploreClick}
            suggestion={'Belum punya ide 😪'}
          />
          <Suggestion
            key={'analyzeMarket'}
            onClick={() =>
              onSendMessage(
                'Analisis peluang bisnis di industri teknologi saat ini'
              )
            }
            suggestion={'Analisis peluang pasar 🎯'}
          />
          <Suggestion
            key={'validateIdea'}
            onClick={() => onSendMessage('Bantu validasi ide bisnis saya')}
            suggestion={'Validasi ide bisnis 🚀'}
          />
        </Suggestions>
      </motion.div>
    </motion.section>
  );
}
