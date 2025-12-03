'use client';

import type { Idea } from '@/features/landing';
import {
  ExploreSection,
  FloatingGlobeButton,
  Header,
  HeroSection,
} from '@/features/landing';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

// Sample idea data for initial render
const sampleIdeas: Idea[] = [
  {
    id: '1',
    title: 'Aplikasi Kesehatan',
    description: 'Tracking kesehatan harian dan reminder minum obat',
    category: 'Health',
  },
  {
    id: '2',
    title: 'E-Commerce Lokal',
    description: 'Platform jual beli produk UMKM sekitar',
    category: 'Business',
  },
  {
    id: '3',
    title: 'Belajar Bahasa',
    description: 'Aplikasi belajar bahasa dengan AI tutor',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Smart Home',
    description: 'Kontrol perangkat rumah dari smartphone',
    category: 'IoT',
  },
];

export default function Home() {
  const exploreSectionRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const handleSendMessage = (message: string) => {
    // TODO: Implement message handling (e.g., navigate to chat page or start conversation)
    console.log('Message sent:', message);
  };

  const handleExploreClick = () => {
    exploreSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleIdeaClick = (idea: Idea) => {
    // TODO: Implement idea selection (e.g., populate chat input or navigate)
    console.log('Idea selected:', idea);
  };

  const handleGlobeClick = () => {
    router.push('/explore');
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Playful background effects */}
      {/* <GradientBlob />
      <FloatingShapes />
      <SparkleEffect /> */}

      {/* Main content */}
      <div className="relative z-10">
        <Header />

        <HeroSection
          onSendMessage={handleSendMessage}
          onExploreClick={handleExploreClick}
        />
        <div ref={exploreSectionRef}>
          <ExploreSection ideas={sampleIdeas} onIdeaClick={handleIdeaClick} />
        </div>
      </div>

      <FloatingGlobeButton onClick={handleGlobeClick} />
    </div>
  );
}
