'use client';

import type { Bmc } from '@/features/landing';
import {
  BmcExploreSection,
  FloatingGlobeButton,
  Header,
  HeroSection,
} from '@/features/landing';
import { dummyBmcs } from '@/features/shared/constants/dummy-bmc';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';

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

  const handleBmcClick = (bmc: Bmc) => {
    // TODO: Implement BMC selection (e.g., navigate to BMC detail)
    console.log('BMC selected:', bmc);
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
          <BmcExploreSection bmcs={dummyBmcs} onBmcClick={handleBmcClick} />
        </div>
      </div>

      <FloatingGlobeButton onClick={handleGlobeClick} />
    </div>
  );
}
