'use client';

import { motion } from 'motion/react';

const shapes = [
  {
    type: 'circle',
    size: 60,
    color: 'bg-primary/20',
    x: '10%',
    y: '20%',
    delay: 0,
  },
  {
    type: 'square',
    size: 40,
    color: 'bg-accent/20',
    x: '85%',
    y: '15%',
    delay: 0.5,
  },
  {
    type: 'circle',
    size: 80,
    color: 'bg-chart-3/15',
    x: '75%',
    y: '60%',
    delay: 1,
  },
  {
    type: 'square',
    size: 50,
    color: 'bg-chart-4/20',
    x: '5%',
    y: '70%',
    delay: 1.5,
  },
  {
    type: 'circle',
    size: 35,
    color: 'bg-accent/25',
    x: '90%',
    y: '80%',
    delay: 2,
  },
  {
    type: 'square',
    size: 45,
    color: 'bg-primary/15',
    x: '20%',
    y: '85%',
    delay: 0.8,
  },
];

export function FloatingShapes() {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.color} ${shape.type === 'circle' ? 'rounded-full' : 'rounded-lg rotate-45'}`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: shape.type === 'square' ? [45, 90, 45] : [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + index * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}
    </div>
  );
}
