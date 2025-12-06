import Link from 'next/link';
import { Suspense } from 'react';
import { ExploreMap, BmcTimeline } from '@/features/explore';
import { Button } from '@/features/shared/components/ui';
import { ChevronLeft } from 'lucide-react';

export default function ExplorePage() {
  return (
    <div className="w-full h-screen relative flex flex-col md:block">
      <header className="absolute top-0 left-0 right-0 z-20 px-2 sm:px-4 py-2 sm:py-3 flex items-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
        </Button>
      </header>

      <Suspense fallback={null}>
        <ExploreMap />
        <div className="absolute bottom-0 left-0 right-0 z-10 p-2 sm:p-0 md:bottom-4 md:left-4 md:right-auto md:w-80 lg:w-96">
          <BmcTimeline className="max-h-[40vh] md:max-h-none" />
        </div>
      </Suspense>
    </div>
  );
}
