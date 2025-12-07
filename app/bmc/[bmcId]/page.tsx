import type { Metadata } from 'next';
import { Suspense } from 'react';
import { pageSEO, generateMetadata as genMeta } from '@/lib/seo';
import { BmcDetailView } from '@/features/explore';

interface BmcDetailPageProps {
  params: Promise<{ bmcId: string }>;
}

export async function generateMetadata({
  params,
}: BmcDetailPageProps): Promise<Metadata> {
  const { bmcId } = await params;
  return genMeta({
    title: 'Business Model Canvas',
    description: `Lihat detail Business Model Canvas - ${bmcId}`,
  });
}

export default async function BmcDetailPage({ params }: BmcDetailPageProps) {
  const { bmcId } = await params;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Memuat...</div>
        </div>
      }
    >
      <BmcDetailView bmcId={bmcId} />
    </Suspense>
  );
}
