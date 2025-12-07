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
  Download,
  Loader2,
} from 'lucide-react';
import { useState, useRef } from 'react';
import { toPng } from 'html-to-image';
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
  const [isDownloading, setIsDownloading] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!printRef.current || !bmc) return;

    setIsDownloading(true);
    try {
      const dataUrl = await toPng(printRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `bmc-${bmcId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to download BMC:', err);
    } finally {
      setIsDownloading(false);
    }
  };

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isDownloading || isLoading || !bmc}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="hidden sm:inline">Mengunduh...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </>
              )}
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
                  <span className="hidden sm:inline">Bagikan</span>
                </>
              )}
            </Button>
          </div>
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

      {/* Hidden Printable BMC - Landscape Layout */}
      <div className="fixed -left-[9999px] top-0">
        <div
          ref={printRef}
          className="w-[1400px] bg-white p-8"
          style={{ fontFamily: 'system-ui, sans-serif' }}
        >
          {/* Print Header */}
          <div className="mb-6 pb-4 border-b-2 border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {location && (
                <span className="flex items-center gap-1">📍 {location}</span>
              )}
              {createdDate && (
                <span className="flex items-center gap-1">
                  📅 {createdDate}
                </span>
              )}
            </div>
          </div>

          {/* Print BMC Grid */}
          <BmcPrintGrid bmc={bmc} />

          {/* Print Footer */}
          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
            Kivo x Imphen x Kolosal AI • Business Model Canvas
          </div>
        </div>
      </div>
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

// Print-specific components with inline styles for html-to-image compatibility
const PRINT_COLORS: Record<string, { bg: string; border: string }> = {
  key_partnerships: { bg: '#fef3c7', border: '#f59e0b' },
  key_activities: { bg: '#dbeafe', border: '#3b82f6' },
  key_resources: { bg: '#dcfce7', border: '#22c55e' },
  value_propositions: { bg: '#fce7f3', border: '#ec4899' },
  customer_relationships: { bg: '#e0e7ff', border: '#6366f1' },
  channels: { bg: '#ffedd5', border: '#f97316' },
  customer_segments: { bg: '#f3e8ff', border: '#a855f7' },
  cost_structure: { bg: '#fee2e2', border: '#ef4444' },
  revenue_streams: { bg: '#d1fae5', border: '#10b981' },
};

interface BmcPrintCardProps {
  tag: string;
  content: string;
  style?: React.CSSProperties;
}

function BmcPrintCard({ tag, content, style }: BmcPrintCardProps) {
  const config = BMC_TAG_CONFIG[tag] || { label: tag, icon: '📋' };
  const colors = PRINT_COLORS[tag] || { bg: '#f3f4f6', border: '#9ca3af' };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        border: `2px solid ${colors.border}`,
        borderRadius: '12px',
        padding: '12px',
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '18px' }}>{config.icon}</span>
        <h3
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: '#1f2937',
            margin: 0,
          }}
        >
          {config.label}
        </h3>
      </div>
      <p
        style={{
          fontSize: '11px',
          lineHeight: 1.5,
          color: '#4b5563',
          margin: 0,
          whiteSpace: 'pre-wrap',
        }}
      >
        {content}
      </p>
    </div>
  );
}

function BmcPrintGrid({ bmc }: BmcDesktopGridProps) {
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Top Row - 5 columns */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
          minHeight: '280px',
        }}
      >
        {/* Key Partners */}
        {keyPartners && (
          <BmcPrintCard
            tag="key_partnerships"
            content={keyPartners.content}
            style={{ height: '100%' }}
          />
        )}

        {/* Key Activities + Key Resources stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {keyActivities && (
            <BmcPrintCard
              tag="key_activities"
              content={keyActivities.content}
              style={{ flex: 1 }}
            />
          )}
          {keyResources && (
            <BmcPrintCard
              tag="key_resources"
              content={keyResources.content}
              style={{ flex: 1 }}
            />
          )}
        </div>

        {/* Value Propositions */}
        {valuePropositions && (
          <BmcPrintCard
            tag="value_propositions"
            content={valuePropositions.content}
            style={{ height: '100%' }}
          />
        )}

        {/* Customer Relationships + Channels stacked */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {customerRelationships && (
            <BmcPrintCard
              tag="customer_relationships"
              content={customerRelationships.content}
              style={{ flex: 1 }}
            />
          )}
          {channels && (
            <BmcPrintCard
              tag="channels"
              content={channels.content}
              style={{ flex: 1 }}
            />
          )}
        </div>

        {/* Customer Segments */}
        {customerSegments && (
          <BmcPrintCard
            tag="customer_segments"
            content={customerSegments.content}
            style={{ height: '100%' }}
          />
        )}
      </div>

      {/* Bottom Row - Cost Structure & Revenue Streams */}
      <div
        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
      >
        {costStructure && (
          <BmcPrintCard tag="cost_structure" content={costStructure.content} />
        )}
        {revenueStreams && (
          <BmcPrintCard
            tag="revenue_streams"
            content={revenueStreams.content}
          />
        )}
      </div>
    </div>
  );
}
