'use client';

import { motion } from 'motion/react';
import { IdeaCard } from './idea-card';
import type { ExploreSectionProps } from '../types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

export function ExploreSection({ ideas, onIdeaClick }: ExploreSectionProps) {
  if (ideas.length === 0) {
    return (
      <section className="container py-12" data-testid="explore-section">
        <h2 className="mb-6 text-xl font-semibold text-foreground">
          Explore ide disekitarmu
        </h2>
        <p className="text-muted-foreground">Belum ada ide tersedia.</p>
      </section>
    );
  }

  return (
    <section className="container py-12" data-testid="explore-section">
      <h2 className="mb-6 text-xl font-semibold text-foreground">
        Explore ide disekitarmu
      </h2>

      {/* Desktop: 4-column grid, Mobile: horizontal scroll */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="hidden md:grid md:grid-cols-4 md:gap-4"
        data-testid="explore-grid"
      >
        {ideas.map((idea) => (
          <motion.div key={idea.id} variants={itemVariants}>
            <IdeaCard idea={idea} onClick={() => onIdeaClick(idea)} />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile: horizontal scroll */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin md:hidden"
        data-testid="explore-scroll"
      >
        {ideas.map((idea) => (
          <motion.div
            key={idea.id}
            variants={itemVariants}
            className="min-w-[200px] shrink-0"
          >
            <IdeaCard idea={idea} onClick={() => onIdeaClick(idea)} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
