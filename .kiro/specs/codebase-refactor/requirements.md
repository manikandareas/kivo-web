# Requirements Document

## Introduction

This spec covers the refactoring of the codebase to improve organization and remove unused code. The main objectives are:

1. Move all AI Elements components from `components/ai-elements/` to `features/shared/components/ai-elements/`
2. Clean up unused functions and imports in the chat API route and related lib/ai files
3. Update all import paths across the codebase

## Glossary

- **AI Elements**: Reusable UI components for AI chat interfaces (conversation, message, prompt-input, etc.)
- **Chat API Route**: The `/api/chat` endpoint that handles AI chat requests
- **lib/ai**: Library folder containing AI-related utilities (auth, messages, validation, prompts, providers, models)

## Requirements

### Requirement 1

**User Story:** As a developer, I want AI Elements components to be located in the shared features folder, so that the codebase follows a consistent feature-based architecture.

#### Acceptance Criteria

1. WHEN the refactoring is complete THEN the system SHALL have all AI Elements components located in `features/shared/components/ai-elements/`
2. WHEN the refactoring is complete THEN the system SHALL have removed the original `components/ai-elements/` folder
3. WHEN any component imports AI Elements THEN the system SHALL use the new import path `@/features/shared/components/ai-elements/*`

### Requirement 2

**User Story:** As a developer, I want the chat API route to only import functions that are actually used, so that the codebase is clean and maintainable.

#### Acceptance Criteria

1. WHEN the chat API route is reviewed THEN the system SHALL remove imports for `validateChatRequest` (not used in current implementation)
2. WHEN the chat API route is reviewed THEN the system SHALL remove imports for `truncateMessages` (not used in current implementation)
3. WHEN the chat API route is reviewed THEN the system SHALL remove imports for `getSystemPrompt` (not used - hardcoded string is used instead)
4. WHEN the chat API route is reviewed THEN the system SHALL remove the unused `ChatMessage` type import

### Requirement 3

**User Story:** As a developer, I want unused lib/ai files to be cleaned up or removed, so that the codebase does not contain dead code.

#### Acceptance Criteria

1. WHEN the cleanup is complete THEN the system SHALL evaluate `lib/ai/auth.ts` for removal (not imported anywhere in production code)
2. WHEN the cleanup is complete THEN the system SHALL evaluate `lib/ai/validation.ts` for removal (not used in chat route)
3. WHEN the cleanup is complete THEN the system SHALL evaluate `lib/ai/messages.ts` for removal (not used in chat route)
4. WHEN the cleanup is complete THEN the system SHALL keep `lib/ai/providers.ts` (used by chat route)
5. WHEN the cleanup is complete THEN the system SHALL keep `lib/ai/models.ts` (used by chat page and landing)
6. WHEN the cleanup is complete THEN the system SHALL evaluate `lib/ai/prompts.ts` for removal (not used - hardcoded in route)

### Requirement 4

**User Story:** As a developer, I want all import paths to be updated correctly after the refactoring, so that the application compiles and runs without errors.

#### Acceptance Criteria

1. WHEN the refactoring is complete THEN the system SHALL update imports in `features/chat/components/message.tsx`
2. WHEN the refactoring is complete THEN the system SHALL update imports in `features/chat/components/messages.tsx`
3. WHEN the refactoring is complete THEN the system SHALL update imports in `features/chat/components/chat-input.tsx`
4. WHEN the refactoring is complete THEN the system SHALL update imports in `features/chat/components/thinking-message.tsx`
5. WHEN the refactoring is complete THEN the system SHALL update imports in `features/landing/components/hero-section.tsx`
6. WHEN the refactoring is complete THEN the system SHALL have no TypeScript compilation errors
