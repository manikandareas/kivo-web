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
  icon?: string;
  category?: string;
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

export interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}
