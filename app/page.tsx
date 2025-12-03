'use client';

import { useRef } from 'react';
import { HeroSection, ExploreSection } from '@/features/landing';
import type { Idea } from '@/features/landing';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';

// Sample idea data for initial render
const sampleIdeas: Idea[] = [
  {
    id: '1',
    title: 'Aplikasi Kesehatan',
    description: 'Tracking kesehatan harian dan reminder minum obat',
    icon: '💊',
    category: 'Health',
  },
  {
    id: '2',
    title: 'E-Commerce Lokal',
    description: 'Platform jual beli produk UMKM sekitar',
    icon: '🛒',
    category: 'Business',
  },
  {
    id: '3',
    title: 'Belajar Bahasa',
    description: 'Aplikasi belajar bahasa dengan AI tutor',
    icon: '📚',
    category: 'Education',
  },
  {
    id: '4',
    title: 'Smart Home',
    description: 'Kontrol perangkat rumah dari smartphone',
    icon: '🏠',
    category: 'IoT',
  },
];

export default function Home() {
  const exploreSectionRef = useRef<HTMLDivElement>(null);

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

  const { data } = authClient.useSession();
  console.log(data);
  return (
    <div className="min-h-screen bg-background">
      <header className="w-full border-b ">
        <div className=" mx-auto p-6 w-full">
          <Image src={'/logo.svg'} width={100} height={40} alt="Kivo" />
        </div>
      </header>
      <p className="text-red-500">{data?.user.email}</p>
      <HeroSection
        onSendMessage={handleSendMessage}
        onExploreClick={handleExploreClick}
      />
      <div ref={exploreSectionRef}>
        <ExploreSection ideas={sampleIdeas} onIdeaClick={handleIdeaClick} />
      </div>
    </div>
  );
}
