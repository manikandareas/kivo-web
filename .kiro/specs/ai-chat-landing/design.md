# Design Document

## Overview

Halaman awal AI Chat untuk Kivo adalah single-page landing yang berfungsi sebagai entry point untuk interaksi pengguna dengan AI. Desain mengikuti pendekatan minimalis dengan fokus pada dua area utama: Hero Section untuk input chat dan Explore Section untuk discovery ide.

## Architecture

```
app/
├── page.tsx                    # Landing page (modified)
├── globals.css                 # Existing styles
└── components/
    └── landing/
        ├── hero-section.tsx    # Hero with title and chat input
        ├── chat-input.tsx      # Multi-line input with send button
        ├── cta-button.tsx      # "Belum ada ide?" button
        ├── explore-section.tsx # Explore ideas section
        └── idea-card.tsx       # Individual idea card
```

## Components and Interfaces

### 1. HeroSection Component
```typescript
interface HeroSectionProps {
  onSendMessage: (message: string) => void;
  onExploreClick: () => void;
}
```
- Renders centered title "Kembangkan Ide lu"
- Contains ChatInput and CTAButton
- Uses `container-landing` utility for max-width

### 2. ChatInput Component
```typescript
interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
}
```
- Multi-line textarea with auto-resize capability
- Send button positioned bottom-right with paper plane icon (lucide-react)
- Rounded border using `--radius` variable
- Focus state with ring effect

### 3. CTAButton Component
```typescript
interface CTAButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}
```
- Outlined/bordered button style
- Centered below chat input

### 4. ExploreSection Component
```typescript
interface ExploreSectionProps {
  ideas: Idea[];
  onIdeaClick: (idea: Idea) => void;
}
```
- Section title "Explore ide disekitarmu"
- Horizontal scrollable grid on mobile
- 4-column grid on desktop

### 5. IdeaCard Component
```typescript
interface Idea {
  id: string;
  title: string;
  description?: string;
  icon?: string;
}

interface IdeaCardProps {
  idea: Idea;
  onClick: () => void;
}
```
- Rounded corners using card styling
- Consistent aspect ratio
- Hover state for interactivity

## Data Models

```typescript
// Message model for chat
interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  role: 'user' | 'assistant';
}

// Idea model for explore section
interface Idea {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  category?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Chat input accepts multi-line text
*For any* string input including newline characters, the ChatInput component SHALL accept and display the complete text without truncation or modification.
**Validates: Requirements 2.3**

### Property 2: Send action invocation
*For any* non-empty input value, when the Send_Button is clicked, the onSend callback SHALL be invoked exactly once.
**Validates: Requirements 2.5**

### Property 3: Idea cards rendering completeness
*For any* array of Idea objects passed to ExploreSection, the component SHALL render exactly one IdeaCard for each Idea in the array, maintaining the same count.
**Validates: Requirements 4.2**

### Property 4: Idea card click handling
*For any* IdeaCard, when clicked, the onClick callback SHALL be invoked with the corresponding Idea object.
**Validates: Requirements 4.5**

## Error Handling

| Scenario | Handling |
|----------|----------|
| Empty message submission | Prevent submission, keep input focused |
| No ideas available | Show empty state message in ExploreSection |
| Network error on send | Display toast notification with retry option |

## Micro-Interactions (Motion Library)

Using `motion` (formerly framer-motion) for playful animations:

### Page Load Animations
```typescript
// Staggered fade-in for hero elements
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};
```

### Hover Interactions
- IdeaCard: `whileHover={{ scale: 1.02, y: -4 }}` with shadow increase
- SendButton: `whileHover={{ rotate: 15 }}` on icon
- CTAButton: `whileTap={{ scale: 0.98 }}` for press feedback

### Scroll Animations
- ExploreSection: Use `whileInView` for staggered card entrance
- Cards animate with `initial={{ opacity: 0, y: 30 }}` → `animate={{ opacity: 1, y: 0 }}`

## Testing Strategy

### Unit Testing
- Use Vitest for unit tests
- Test component rendering with different props
- Test user interactions (click, input change)

### Property-Based Testing
- Use fast-check library for property-based tests
- Minimum 100 iterations per property test
- Focus on state consistency and rendering completeness

### Test Coverage
- ChatInput: value binding, send action, empty validation
- IdeaCard: click handling, content rendering
- ExploreSection: grid rendering, scroll behavior
