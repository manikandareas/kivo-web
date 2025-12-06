'use client';

import { useMemo, useState } from 'react';
import { ScrollArea } from '@/features/shared/components/ui';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/features/shared/components/ui/collapsible';
import { dummyBmcs, Bmc } from '@/features/shared/constants/dummy-bmc';
import { cn } from '@/lib/utils';
import { useSelectedBmc } from '../hooks/use-selected-bmc';
import { ChevronDownIcon } from 'lucide-react';

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

function getLocationName(lat: number, lon: number): string {
  const locations: Record<string, { lat: number; lon: number }> = {
    Jakarta: { lat: -6.2, lon: 106.816666 },
    Bandung: { lat: -6.914744, lon: 107.60981 },
    Surabaya: { lat: -7.250445, lon: 112.768845 },
    Yogyakarta: { lat: -7.79558, lon: 110.36949 },
    Denpasar: { lat: -8.65, lon: 115.216667 },
    Medan: { lat: 3.589665, lon: 98.673447 },
    Makassar: { lat: -5.147665, lon: 119.432732 },
    Samarinda: { lat: -0.502183, lon: 117.153801 },
    Palembang: { lat: -2.990934, lon: 104.756554 },
    Manado: { lat: 1.47483, lon: 124.842079 },
  };

  for (const [name, coords] of Object.entries(locations)) {
    if (Math.abs(coords.lat - lat) < 0.1 && Math.abs(coords.lon - lon) < 0.1) {
      return name;
    }
  }
  return 'Indonesia';
}

function getBmcTitle(bmc: Bmc): string {
  const vp = bmc.items.find((i) => i.tag === 'value_propositions');
  return vp?.content[0] || 'Business Model Canvas';
}

function getBmcSegment(bmc: Bmc): string {
  const cs = bmc.items.find((i) => i.tag === 'customer_segments');
  return cs?.content[0] || '';
}

interface BmcTimelineItemProps {
  bmc: Bmc;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

function BmcTimelineItem({ bmc, isSelected, onSelect }: BmcTimelineItemProps) {
  const location = getLocationName(bmc.coordinates.lat, bmc.coordinates.lon);
  const title = getBmcTitle(bmc);
  const segment = getBmcSegment(bmc);
  const relativeTime = formatRelativeTime(bmc.createdAt);

  return (
    <div
      className={cn(
        'flex gap-3 py-3 px-4 hover:bg-white/5 transition-colors rounded-lg cursor-pointer',
        isSelected && 'bg-blue-500/10 border-l-2 border-blue-500'
      )}
      onClick={() => onSelect(bmc.id)}
    >
      <div className="shrink-0 mt-1">
        <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
          <svg
            className="w-4 h-4 text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-white/90 truncate">{title}</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs px-2 py-0.5 bg-white/10 rounded text-white/70">
            {location}
          </span>
          {segment && (
            <span className="text-xs text-white/50 truncate">{segment}</span>
          )}
        </div>
        <div className="text-xs text-white/40 mt-1">{relativeTime}</div>
      </div>
    </div>
  );
}

interface BmcTimelineProps {
  className?: string;
}

export function BmcTimeline({ className }: BmcTimelineProps) {
  const { selectedBmcId, setSelectedBmcId } = useSelectedBmc();
  const [isOpen, setIsOpen] = useState(false);

  const sortedBmcs = useMemo(() => {
    return [...dummyBmcs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, []);

  const timelineContent = (
    <ScrollArea className="h-[200px] sm:h-[300px]">
      <div className="py-2">
        {sortedBmcs.map((bmc) => (
          <BmcTimelineItem
            key={bmc.id}
            bmc={bmc}
            isSelected={selectedBmcId === bmc.id}
            onSelect={setSelectedBmcId}
          />
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <div
      className={cn(
        'bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden',
        className
      )}
    >
      {/* Mobile: Collapsible */}
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="sm:hidden">
        <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-medium text-white/80">Recent Activity</h3>
          <ChevronDownIcon
            className={cn(
              'w-4 h-4 text-white/60 transition-transform duration-200',
              isOpen && 'rotate-180'
            )}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>{timelineContent}</CollapsibleContent>
      </Collapsible>

      {/* Desktop: Always visible */}
      <div className="hidden sm:block">
        <div className="px-4 py-3 border-b border-white/10">
          <h3 className="text-sm font-medium text-white/80">Recent Activity</h3>
        </div>
        {timelineContent}
      </div>
    </div>
  );
}
