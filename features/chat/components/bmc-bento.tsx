'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/features/shared/components/ui/scroll-area';
import { ChevronDown } from 'lucide-react';
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

// Desktop Bento Card
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
        <h3 className="truncate text-xs font-semibold text-foreground">
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
        <div className="mt-1 text-[9px] font-medium text-primary/70">
          Tap untuk selengkapnya...
        </div>
      )}
    </div>
  );
}

// Mobile Accordion Item
function BmcAccordionItem({ item, isExpanded, onToggle }: BmcCardProps) {
  const config = BMC_TAG_CONFIG[item.tag] || {
    label: item.tag,
    icon: '📋',
    color: 'from-gray-500/20 to-gray-600/10 border-gray-500/30',
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-linear-to-br transition-all duration-300',
        config.color,
        isExpanded && 'ring-2 ring-primary/50'
      )}
    >
      {/* Header - Always visible */}
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{config.icon}</span>
          <h3 className="text-sm font-semibold text-foreground">
            {config.label}
          </h3>
        </div>
        <ChevronDown
          className={cn(
            'h-5 w-5 text-muted-foreground transition-transform duration-300',
            isExpanded && 'rotate-180'
          )}
        />
      </button>

      {/* Content - Expandable */}
      <div
        className={cn(
          'grid transition-all duration-300',
          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className="overflow-hidden">
          <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground">
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
}

// Ordered list for mobile accordion view
const BMC_ORDER = [
  'value_propositions',
  'customer_segments',
  'channels',
  'customer_relationships',
  'revenue_streams',
  'key_resources',
  'key_activities',
  'key_partnerships',
  'cost_structure',
] as const;

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

  // Get ordered items for mobile view
  const orderedItems = BMC_ORDER.map((tag) => getItemByTag(tag)).filter(
    Boolean
  ) as BmcChatItem[];

  return (
    <ScrollArea className={cn('h-full', className)}>
      <div className="p-4">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground md:text-lg">
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

        {/* Mobile: Accordion List */}
        <div className="flex flex-col gap-2 md:hidden">
          {orderedItems.map((item) => (
            <BmcAccordionItem
              key={item.tag}
              item={item}
              isExpanded={expandedTag === item.tag}
              onToggle={() => handleToggle(item.tag)}
            />
          ))}
        </div>

        {/* Desktop: BMC Bento Grid */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-2">
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
