# Implementation Plan

- [x] 1. Set up component structure and dependencies
  - [x] 1.1 Install motion library and create directory structure
    - Install `motion` package
    - Create `app/components/landing/` directory
    - Create placeholder files for all components
    - _Requirements: 1.1, 2.1, 6.1_
  - [x] 1.2 Define TypeScript interfaces and types
    - Create `types.ts` with Idea and ChatMessage interfaces
    - Export interfaces for component props
    - _Requirements: 2.1, 4.2_

- [x] 2. Implement ChatInput component
  - [x] 2.1 Create ChatInput component with textarea and send button
    - Implement multi-line textarea with controlled value
    - Add Send button with lucide-react Send icon
    - Position button at bottom-right of input area
    - Apply styling using CSS variables from globals.css
    - Add hover animation on send button icon (whileHover rotate)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.3_
  - [x] 2.2 Write property test for ChatInput multi-line acceptance
    - **Property 1: Chat input accepts multi-line text**
    - **Validates: Requirements 2.3**
  - [x] 2.3 Write property test for send action invocation
    - **Property 2: Send action invocation**
    - **Validates: Requirements 2.5**

- [x] 3. Implement CTAButton component
  - [x] 3.1 Create CTAButton with outlined style and press animation
    - Implement button with bordered/outline appearance
    - Add click handler for scroll/navigation action
    - Add whileTap scale animation for tactile feedback
    - _Requirements: 3.1, 3.2, 3.3, 6.4_

- [x] 4. Implement IdeaCard component
  - [x] 4.1 Create IdeaCard component with hover animation
    - Implement card with rounded corners using --radius
    - Add click handler for idea selection
    - Apply card styling from design system
    - Add whileHover scale and lift animation (scale: 1.02, y: -4)
    - _Requirements: 4.4, 4.5, 6.2_
  - [x] 4.2 Write property test for idea card click handling
    - **Property 4: Idea card click handling**
    - **Validates: Requirements 4.5**

- [x] 5. Implement ExploreSection component
  - [x] 5.1 Create ExploreSection with grid layout and scroll animations
    - Add section title "Explore ide disekitarmu"
    - Implement 4-column grid for desktop
    - Add horizontal scroll for mobile
    - Render IdeaCard for each idea in array
    - Add whileInView staggered entrance animation for cards
    - _Requirements: 4.1, 4.2, 4.3, 6.5_
  - [x] 5.2 Write property test for idea cards rendering completeness
    - **Property 3: Idea cards rendering completeness**
    - **Validates: Requirements 4.2**

- [x] 6. Implement HeroSection component
  - [x] 6.1 Create HeroSection with title, components, and entrance animations
    - Add centered title "Kembangkan Ide lu"
    - Integrate ChatInput component
    - Integrate CTAButton component
    - Apply container-landing utility for max-width
    - Add staggered fade-in and slide-up animation on page load
    - _Requirements: 1.1, 1.2, 1.3, 6.1_

- [x] 7. Integrate landing page
  - [x] 7.1 Update app/page.tsx with landing components
    - Import and compose HeroSection and ExploreSection
    - Add sample idea data for initial render
    - Wire up event handlers (onSendMessage, onIdeaClick)
    - _Requirements: 1.1, 5.1, 5.2, 5.3, 5.4_

- [x] 8. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.
