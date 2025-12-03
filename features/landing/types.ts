// Data Models

/** Message model for chat */
export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
}

/** Idea model for explore section */
export interface Idea {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  author?: string;
  overlayTitle?: string;
  overlaySubtitle?: string;
}

/** BMC models for explore section */
export interface BmcItem {
  tag: string;
  content: string[];
}

export interface BmcCoordinates {
  lat: number;
  lon: number;
}

export interface Bmc {
  id: string;
  authorId: string;
  isPublic: boolean;
  coordinates: BmcCoordinates;
  items: BmcItem[];
  createdAt: string;
  updatedAt: string;
}

// Component Props

export interface HeroSectionProps {
  onSendMessage: (message: string) => void;
  onExploreClick: () => void;
}

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}

export interface CTAButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export interface ExploreSectionProps {
  ideas: Idea[];
  onIdeaClick: (idea: Idea) => void;
}

export interface BmcExploreSectionProps {
  bmcs: Bmc[];
  onBmcClick: (bmc: Bmc) => void;
}

export interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}

export interface BmcCardProps {
  bmc: Bmc;
  onClick: () => void;
}
