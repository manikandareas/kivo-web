'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/features/shared/components/ui/scroll-area';
import type { BmcChatItem } from '../types/bmc';
import { BMC_TAG_CONFIG } from '../types/bmc';

interface BmcBentoProps {
  items: BmcChatItem[];
  className?: string;
}

interface BmcCardProps {
  item: BmcChatItem;
  className?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
}

function BmcCard({ item, className, isExpanded, onToggle }: BmcCardProps) {
  const config = BMC_TAG_CONFIG[item.tag] || {
    label: item.tag,
    icon: '📋',
    color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
  };

  return (
    <div
      onClick={onToggle}
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-xl border bg-linear-to-br p-3 transition-all duration-300 hover:shadow-md',
        config.color,
        isExpanded && 'ring-2 ring-primary/50',
        className
      )}
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-2">
        <span className="text-base">{config.icon}</span>
        <h3 className="text-xs font-semibold text-foreground truncate">
          {config.label}
        </h3>
      </div>

      {/* Content */}
      <p
        className={cn(
          'text-[10px] leading-relaxed text-muted-foreground transition-all duration-300',
          isExpanded ? 'line-clamp-none' : 'line-clamp-3'
        )}
      >
        {item.content}
      </p>

      {/* Expand indicator */}
      {!isExpanded && item.content.length > 120 && (
        <div className="mt-1 text-[9px] text-primary/70 font-medium">
          Tap untuk selengkapnya...
        </div>
      )}
    </div>
  );
}

export function BmcBento({ items, className }: BmcBentoProps) {
  const [expandedTag, setExpandedTag] = useState<string | null>(null);

  const getItemByTag = (tag: string) => items.find((item) => item.tag === tag);

  const handleToggle = (tag: string) => {
    setExpandedTag(expandedTag === tag ? null : tag);
  };

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
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Business Model Canvas
            </h2>
            <p className="text-xs text-muted-foreground">
              Visualisasi model bisnis Anda
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <span className="text-sm">📊</span>
          </div>
        </div>

        {/* BMC Bento Grid */}
        <div className="grid grid-cols-3 gap-2">
          {/* Row 1: Key Partners (tall) | Key Activities | Value Props (tall) */}
          {keyPartners && (
            <BmcCard
              item={keyPartners}
              className="row-span-2"
              isExpanded={expandedTag === 'key_partnerships'}
              onToggle={() => handleToggle('key_partnerships')}
            />
          )}
          {keyActivities && (
            <BmcCard
              item={keyActivities}
              isExpanded={expandedTag === 'key_activities'}
              onToggle={() => handleToggle('key_activities')}
            />
          )}
          {valuePropositions && (
            <BmcCard
              item={valuePropositions}
              className="row-span-2"
              isExpanded={expandedTag === 'value_propositions'}
              onToggle={() => handleToggle('value_propositions')}
            />
          )}

          {/* Row 2: (Key Partners cont.) | Key Resources | (Value Props cont.) */}
          {keyResources && (
            <BmcCard
              item={keyResources}
              isExpanded={expandedTag === 'key_resources'}
              onToggle={() => handleToggle('key_resources')}
            />
          )}

          {/* Row 3: Customer Relationships | Channels | Customer Segments (tall) */}
          {customerRelationships && (
            <BmcCard
              item={customerRelationships}
              isExpanded={expandedTag === 'customer_relationships'}
              onToggle={() => handleToggle('customer_relationships')}
            />
          )}
          {channels && (
            <BmcCard
              item={channels}
              isExpanded={expandedTag === 'channels'}
              onToggle={() => handleToggle('channels')}
            />
          )}
          {customerSegments && (
            <BmcCard
              item={customerSegments}
              className="row-span-2"
              isExpanded={expandedTag === 'customer_segments'}
              onToggle={() => handleToggle('customer_segments')}
            />
          )}

          {/* Row 4: Cost Structure (wide) | (Customer Segments cont.) */}
          {costStructure && (
            <BmcCard
              item={costStructure}
              className="col-span-2"
              isExpanded={expandedTag === 'cost_structure'}
              onToggle={() => handleToggle('cost_structure')}
            />
          )}

          {/* Row 5: Revenue Streams (full width) */}
          {revenueStreams && (
            <BmcCard
              item={revenueStreams}
              className="col-span-3"
              isExpanded={expandedTag === 'revenue_streams'}
              onToggle={() => handleToggle('revenue_streams')}
            />
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
