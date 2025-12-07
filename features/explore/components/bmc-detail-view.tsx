'use client';

import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useState } from 'react';
import { useBmcDetail } from '../hooks/use-bmc-detail';
import { BMC_TAG_CONFIG } from '@/features/chat/types/bmc';
import { Button } from '@/features/shared/components/ui/button';
import { cn } from '@/lib/utils';

interface BmcDetailViewProps {
  bmcId: string;
}

const BMC_ORDER = [
  'key_partnerships',
  'key_activities',
  'key_resources',
  'value_propositions',
  'customer_relationships',
  'channels',
  'customer_segments',
  'cost_structure',
  'revenue_streams',
] as const;

function getLocationName(lat: number, lon: number): string {
  const locations: Record<string, { lat: number; lon: number }> = {
    Jakarta: { lat: -6.2, lon: 106.816666 },
    Bandung: { lat: -6.914744, lon: 107.60981 },
    Surabaya: { lat: -7.250445, lon: 112.768845 },
    Yogyakarta: { lat: -7.79558, lon: 110.36949 },
    Denpasar: { lat: -8.65, lon: 115.216667 },
    Medan: { lat: 3.589665, lon: 98.673447 },
    Makassar: { lat: -5.147665, lon: 119.432732 },
  };

  for (const [name, coords] of Object.entries(locations)) {
    if (Math.abs(coords.lat - lat) < 0.5 && Math.abs(coords.lon - lon) < 0.5) {
      return name;
    }
  }
  return 'Indonesia';
}

export function BmcDetailView({ bmcId }: BmcDetailViewProps) {
  const { bmc, isLoading, error } = useBmcDetail(bmcId);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({
        title: 'Business Model Canvas',
        text: 'Lihat Business Model Canvas ini!',
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !bmc) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center space-y-4 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-semibold">BMC Tidak Ditemukan</h1>
          <p className="text-muted-foreground text-sm max-w-md">
            {error || 'Business Model Canvas yang Anda cari tidak tersedia.'}
          </p>
          <Button asChild variant="outline">
            <Link href="/explore">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Explore
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const getItemByTag = (tag: string) =>
    bmc.items.find((item) => item.tag === tag);
  const valueProposition =
    getItemByTag('value_propositions')?.content || 'Business Model Canvas';
  const title =
    valueProposition.split(',')[0]?.trim() || 'Business Model Canvas';
  const location = bmc.location
    ? getLocationName(bmc.location.latitude, bmc.location.longitude)
    : null;
  const createdDate = (() => {
    if (!bmc.createdAt) return null;
    let date = new Date(bmc.createdAt);
    // If timestamp is in seconds (Unix), convert to milliseconds
    if (date.getFullYear() < 2000 && typeof bmc.createdAt === 'number') {
      date = new Date(bmc.createdAt * 1000);
    }
    // Check if date is valid and not epoch (1970)
    if (isNaN(date.getTime()) || date.getFullYear() < 2000) return null;
    return format(date, 'd MMMM yyyy', { locale: id });
  })();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Kembali</span>
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Tersalin!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 mr-2" />
                Bagikan
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-6 md:py-10">
        {/* Title Section */}
        <div className="mb-8 space-y-3">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {location && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {location}
              </span>
            )}
            {createdDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {createdDate}
              </span>
            )}
          </div>
        </div>

        {/* BMC Grid - Desktop */}
        <div className="hidden md:block">
          <BmcDesktopGrid bmc={bmc} />
        </div>

        {/* BMC List - Mobile */}
        <div className="md:hidden space-y-3">
          {BMC_ORDER.map((tag) => {
            const item = getItemByTag(tag);
            if (!item) return null;
            return <BmcCard key={tag} tag={tag} content={item.content} />;
          })}
        </div>
      </main>
    </div>
  );
}

interface BmcCardProps {
  tag: string;
  content: string;
  className?: string;
}

function BmcCard({ tag, content, className }: BmcCardProps) {
  const config = BMC_TAG_CONFIG[tag] || {
    label: tag,
    icon: '📋',
    color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border bg-linear-to-br p-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]',
        config.color,
        className
      )}
    >
      <div className="flex items-center gap-2.5 mb-3">
        <span className="text-xl">{config.icon}</span>
        <h3 className="text-sm font-semibold text-foreground">
          {config.label}
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
        {content}
      </p>
    </div>
  );
}

interface BmcDesktopGridProps {
  bmc: {
    items: { tag: string; content: string }[];
  };
}

function BmcDesktopGrid({ bmc }: BmcDesktopGridProps) {
  const getItemByTag = (tag: string) =>
    bmc.items.find((item) => item.tag === tag);

  const keyPartners = getItemByTag('key_partnerships');
  const keyActivities = getItemByTag('key_activities');
  const keyResources = getItemByTag('key_resources');
  const valuePropositions = getItemByTag('value_propositions');
  const customerRelationships = getItemByTag('customer_relationships');
  const channels = getItemByTag('channels');
  const customerSegments = getItemByTag('customer_segments');
  const costStructure = getItemByTag('cost_structure');
  const revenueStreams = getItemByTag('revenue_streams');

  return (
    <div className="grid grid-cols-10 gap-3 auto-rows-fr">
      {/* Row 1-2: Main BMC structure */}
      {/* Key Partners - 2 cols, 2 rows */}
      {keyPartners && (
        <BmcCard
          tag="key_partnerships"
          content={keyPartners.content}
          className="col-span-2 row-span-2"
        />
      )}

      {/* Key Activities & Key Resources - 2 cols each, stacked */}
      <div className="col-span-2 row-span-2 flex flex-col gap-3">
        {keyActivities && (
          <BmcCard
            tag="key_activities"
            content={keyActivities.content}
            className="flex-1"
          />
        )}
        {keyResources && (
          <BmcCard
            tag="key_resources"
            content={keyResources.content}
            className="flex-1"
          />
        )}
      </div>

      {/* Value Propositions - 2 cols, 2 rows */}
      {valuePropositions && (
        <BmcCard
          tag="value_propositions"
          content={valuePropositions.content}
          className="col-span-2 row-span-2"
        />
      )}

      {/* Customer Relationships & Channels - 2 cols each, stacked */}
      <div className="col-span-2 row-span-2 flex flex-col gap-3">
        {customerRelationships && (
          <BmcCard
            tag="customer_relationships"
            content={customerRelationships.content}
            className="flex-1"
          />
        )}
        {channels && (
          <BmcCard
            tag="channels"
            content={channels.content}
            className="flex-1"
          />
        )}
      </div>

      {/* Customer Segments - 2 cols, 2 rows */}
      {customerSegments && (
        <BmcCard
          tag="customer_segments"
          content={customerSegments.content}
          className="col-span-2 row-span-2"
        />
      )}

      {/* Row 3: Cost Structure & Revenue Streams */}
      {costStructure && (
        <BmcCard
          tag="cost_structure"
          content={costStructure.content}
          className="col-span-5"
        />
      )}
      {revenueStreams && (
        <BmcCard
          tag="revenue_streams"
          content={revenueStreams.content}
          className="col-span-5"
        />
      )}
    </div>
  );
}
