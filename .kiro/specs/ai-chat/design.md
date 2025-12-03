# Design Document

## Overview

Fitur AI Chat untuk Kivo mengikuti arsitektur dari Vercel AI Chatbot sebagai best practice. Sistem ini menggunakan Vercel AI SDK (`@ai-sdk/react`) untuk mengelola state chat, streaming response, dan komunikasi dengan AI backend. Arsitektur terdiri dari komponen-komponen modular yang dapat digunakan kembali.

## Architecture

```
app/
├── (chat)/
│   ├── page.tsx                    # New chat page
│   ├── chat/[id]/page.tsx          # Existing chat page
│   └── layout.tsx                  # Chat layout with sidebar
│
components/
├── ai-elements/                    # AI Elements UI components (from library)
│   ├── message.tsx                 # Message component
│   ├── prompt-input.tsx            # Prompt input component
│   ├── loader.tsx                  # Loading indicator
│   ├── reasoning.tsx               # Reasoning/thinking display
│   ├── conversation.tsx            # Conversation container
│   └── suggestion.tsx              # Suggestion buttons (existing)
│
features/
├── chat/
│   ├── components/
│   │   ├── chat.tsx                # Main chat component (uses AI Elements)
│   │   ├── messages.tsx            # Messages list (uses AI Elements Message)
│   │   ├── chat-input.tsx          # Chat input (uses AI Elements PromptInput)
│   │   ├── thinking-message.tsx    # Loading (uses AI Elements Loader)
│   │   └── data-stream-handler.tsx # Stream data handler
│   ├── hooks/
│   │   ├── use-messages.ts         # Messages scroll management
│   │   └── use-auto-resume.ts      # Auto resume stream
│   ├── types.ts                    # TypeScript interfaces
│   └── index.ts                    # Public exports
│
lib/
├── ai/
│   └── models.ts                   # AI model configurations
└── utils.ts                        # Utility functions (generateUUID)
```

## AI Elements Components Used

Fitur ini menggunakan komponen dari AI Elements library untuk konsistensi UI:

| AI Element     | Usage                                                         |
| -------------- | ------------------------------------------------------------- |
| `Message`      | Menampilkan pesan user dan assistant dengan styling konsisten |
| `PromptInput`  | Input area dengan textarea, submit button, dan toolbar        |
| `Loader`       | Indikator loading saat AI sedang memproses                    |
| `Reasoning`    | Menampilkan chain-of-thought dari AI (jika ada)               |
| `Conversation` | Container untuk daftar pesan                                  |
| `Suggestion`   | Tombol suggestion untuk quick actions                         |

## Components and Interfaces

### 1. Chat Component (Main)

```typescript
interface ChatProps {
  id: string;
  initialMessages: ChatMessage[];
  initialChatModel: string;
  initialVisibilityType: VisibilityType;
  isReadonly: boolean;
  autoResume: boolean;
}
```

- Komponen utama yang mengorkestrasi seluruh chat
- Menggunakan `useChat` hook dari `@ai-sdk/react`
- Mengelola state: messages, input, attachments, status
- Menangani submit, stop, dan regenerate

### 2. Messages Component

```typescript
interface MessagesProps {
  chatId: string;
  status: UseChatHelpers['status'];
  messages: ChatMessage[];
  setMessages: UseChatHelpers['setMessages'];
  regenerate: UseChatHelpers['regenerate'];
  isReadonly: boolean;
}
```

- Menampilkan daftar pesan dengan scroll management
- Auto-scroll ke pesan terbaru
- Tombol "scroll to bottom" saat user scroll up
- Menampilkan ThinkingMessage saat status "submitted"

### 3. Message Component

```typescript
interface MessageProps {
  message: ChatMessage;
  isLoading: boolean;
  isReadonly: boolean;
}
```

- Render single message dengan styling berdasarkan role
- User message: right-aligned, blue background
- Assistant message: left-aligned, dengan icon
- Support untuk streaming content

### 4. MultimodalInput Component

```typescript
interface MultimodalInputProps {
  chatId: string;
  input: string;
  setInput: (value: string) => void;
  status: UseChatHelpers['status'];
  stop: () => void;
  sendMessage: UseChatHelpers['sendMessage'];
}
```

- Textarea dengan auto-resize
- Submit button (disabled saat streaming)
- Stop button (visible saat streaming)
- Keyboard shortcut: Enter to submit, Shift+Enter for newline

### 5. DataStreamHandler Component

```typescript
// No props - uses context
```

- Menangani streaming data dari AI response
- Menggunakan React Context untuk share state

## Data Models

```typescript
// Chat message model (compatible with Vercel AI SDK)
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

// Extended message with parts (for multimodal)
interface ChatMessageWithParts {
  id: string;
  role: 'user' | 'assistant';
  parts: MessagePart[];
  createdAt?: Date;
}

type MessagePart =
  | { type: 'text'; text: string }
  | { type: 'file'; url: string; mediaType: string };

// Visibility type
type VisibilityType = 'private' | 'public';

// Chat session
interface Chat {
  id: string;
  userId: string;
  title?: string;
  visibility: VisibilityType;
  createdAt: Date;
  updatedAt: Date;
}

// AI Model configuration
interface ChatModel {
  id: string;
  name: string;
  provider: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Unique ID Generation

_For any_ N generated chat IDs using generateUUID, all N IDs SHALL be unique (no duplicates in the set).
**Validates: Requirements 1.1**

### Property 2: Message Submission Adds to List

_For any_ valid (non-empty) message content, when submitted, the messages array SHALL increase by exactly one element with role "user" and the submitted content.
**Validates: Requirements 2.2**

### Property 3: Empty Message Validation

_For any_ string composed entirely of whitespace characters (including empty string), the System SHALL prevent submission and the messages array SHALL remain unchanged.
**Validates: Requirements 2.5**

### Property 4: Message Rendering Completeness

_For any_ array of ChatMessage objects passed to Messages component, the component SHALL render exactly one message element for each message in the array.
**Validates: Requirements 3.1, 4.2**

### Property 5: Authorization Access Control

_For any_ chat with visibility "private" and userId different from current session userId, the System SHALL deny access and return not found.
**Validates: Requirements 4.5**

### Property 6: Partial Response Preservation

_For any_ streaming response that is stopped mid-stream, the partial content received up to that point SHALL be preserved in the messages array.
**Validates: Requirements 6.3**

## Error Handling

| Scenario                 | Handling                                     |
| ------------------------ | -------------------------------------------- |
| Empty message submission | Prevent submission, show toast warning       |
| API error (500)          | Display error toast with message             |
| Network error            | Display error toast with retry option        |
| Chat not found           | Redirect to 404 page                         |
| Unauthorized access      | Redirect to 404 (security through obscurity) |
| Session expired          | Redirect to login page                       |
| Stream interruption      | Preserve partial response, allow retry       |

## Testing Strategy

### Unit Testing

- Use Vitest for unit tests
- Test component rendering with different props
- Test user interactions (click, input change, submit)
- Test hook behavior (useMessages, useAutoResume)

### Property-Based Testing

- Use fast-check library for property-based tests
- Minimum 100 iterations per property test
- Tag each test with: **Feature: ai-chat, Property {number}: {property_text}**

### Test Coverage Focus

- generateUUID: uniqueness property
- Message submission: state changes
- Input validation: empty/whitespace handling
- Messages component: rendering completeness
- Authorization: access control logic
- Stop functionality: state preservation

### Integration Testing

- Chat flow: new chat → send message → receive response
- Existing chat: load → display messages → continue conversation
- Error scenarios: API errors, network failures
