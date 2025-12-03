import Link from 'next/link';
import { ExploreMap, BmcTimeline } from '@/features/explore';
import { Button } from '@/features/shared/components/ui';
import { ChevronLeft } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="w-full h-screen relative">
      <header className="absolute top-0 left-0 right-0 z-20 px-4 py-3 flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ChevronLeft />
            Back
          </Link>
        </Button>
      </header>

      <ExploreMap />
      <div className="absolute bottom-4 left-4 w-md z-10">
        <BmcTimeline />
      </div>
    </div>
  );
}
