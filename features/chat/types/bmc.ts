export interface BmcChatItem {
  tag: string;
  content: string;
}

export interface BmcChatCoordinates {
  lat: number;
  long: number;
  alt: number;
}

export interface BmcChatData {
  _id: { $oid: string };
  coordinat: BmcChatCoordinates;
  authorId: string;
  chatId: string;
  isPublic: boolean;
  items: BmcChatItem[];
  createdAt: { $date: string };
  updatedAt: { $date: string };
  __v: number;
}

// Tag display configuration
export const BMC_TAG_CONFIG: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  customer_segments: {
    label: 'Customer Segments',
    icon: '👥',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30',
  },
  value_propositions: {
    label: 'Value Propositions',
    icon: '💎',
    color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30',
  },
  channels: {
    label: 'Channels',
    icon: '📢',
    color: 'from-green-500/20 to-green-600/10 border-green-500/30',
  },
  customer_relationships: {
    label: 'Customer Relationships',
    icon: '🤝',
    color: 'from-pink-500/20 to-pink-600/10 border-pink-500/30',
  },
  revenue_streams: {
    label: 'Revenue Streams',
    icon: '💰',
    color: 'from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
  },
  key_resources: {
    label: 'Key Resources',
    icon: '🔑',
    color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30',
  },
  key_activities: {
    label: 'Key Activities',
    icon: '⚡',
    color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30',
  },
  key_partnerships: {
    label: 'Key Partnerships',
    icon: '🤲',
    color: 'from-indigo-500/20 to-indigo-600/10 border-indigo-500/30',
  },
  cost_structure: {
    label: 'Cost Structure',
    icon: '📊',
    color: 'from-red-500/20 to-red-600/10 border-red-500/30',
  },
};
