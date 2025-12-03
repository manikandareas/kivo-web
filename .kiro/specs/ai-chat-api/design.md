# Design Document

## Overview

API Route untuk AI Chat Kivo menyediakan endpoint backend yang menangani komunikasi antara frontend dan AI model. Implementasi menggunakan Vercel AI SDK (`ai` package) untuk streaming response dan Next.js App Router untuk API routes. Arsitektur mengikuti pattern dari Vercel AI Chatbot dengan penyederhanaan sesuai kebutuhan Kivo.

## Architecture

```
app/
├── api/
│   └── chat/
│       └── route.ts              # Main chat API endpoint
│
lib/
├── ai/
│   ├── models.ts                 # AI model configurations (existing)
│   ├── providers.ts              # AI provider setup (OpenAI)
│   └── prompts.ts                # System prompts configuration
└── utils.ts                      # Utility functions (existing)
```

### Request Flow

```
┌─────────────┐     POST /api/chat      ┌─────────────┐
│   Frontend  │ ──────────────────────► │  API Route  │
│  (useChat)  │                         │  (route.ts) │
└─────────────┘                         └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  Validate   │
                                        │   Request   │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │  AI Provider│
                                        │  (OpenAI)   │
                                        └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐
                                        │   Stream    │◄──── UI Message Stream
                                        │  Response   │
                                        └─────────────┘
```

## Components and Interfaces

### 1. Chat API Route (`/api/chat`)

```typescript
// POST request body
interface ChatRequestBody {
  id: string; // Chat session ID
  message: ChatMessage; // User message to send
  selectedChatModel: string; // AI model to use
}

// ChatMessage format (from frontend)
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  parts?: MessagePart[];
}
```

### 2. AI Provider Configuration

```typescript
// lib/ai/providers.ts
import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export function getModel(modelId: string) {
  return openai(modelId);
}
```

### 3. System Prompts

```typescript
// lib/ai/prompts.ts
export function getSystemPrompt(): string {
  return `You are a helpful AI assistant for Kivo. 
You provide clear, concise, and accurate responses.
You are friendly and professional in your communication.`;
}
```

### 4. Request Validation Schema

```typescript
// Using Zod for validation
import { z } from 'zod';

export const chatRequestSchema = z.object({
  id: z.string().uuid(),
  message: z.object({
    id: z.string(),
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
    parts: z
      .array(
        z.object({
          type: z.literal('text'),
          text: z.string(),
        })
      )
      .optional(),
  }),
  selectedChatModel: z.string().optional().default('gpt-4o-mini'),
});
```

## Data Models

```typescript
// Request body for POST /api/chat
interface ChatRequestBody {
  id: string;
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    parts?: Array<{ type: 'text'; text: string }>;
  };
  selectedChatModel?: string;
}

// Error response format
interface ErrorResponse {
  error: string;
  code: string;
  status: number;
}

// Stream message format (handled by AI SDK)
type StreamMessage = {
  type: 'text' | 'error' | 'finish';
  content: string;
};
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Request Validation Completeness

_For any_ request body object, the validation function SHALL correctly identify whether all required fields (id, message with content) are present and valid, returning true only when all requirements are met.
**Validates: Requirements 1.2, 1.3**

### Property 2: Unauthorized Request Rejection

_For any_ request without valid authentication credentials, the API SHALL return a 401 status code and never process the message.
**Validates: Requirements 4.1, 4.2**

### Property 3: Message Format Transformation

_For any_ valid ChatMessage from the frontend, the transformation function SHALL produce a model-compatible message format that preserves the role and content.
**Validates: Requirements 6.2**

### Property 4: Context Truncation Preservation

_For any_ array of messages exceeding the context limit, the truncation function SHALL preserve the N most recent messages where N is the maximum allowed, maintaining chronological order.
**Validates: Requirements 6.3**

## Error Handling

| Scenario                | HTTP Status | Error Code       | Response                          |
| ----------------------- | ----------- | ---------------- | --------------------------------- |
| Missing required fields | 400         | `bad_request`    | "Missing required field: {field}" |
| Invalid message format  | 400         | `invalid_format` | "Invalid message format"          |
| No authentication       | 401         | `unauthorized`   | "Authentication required"         |
| Invalid authentication  | 401         | `unauthorized`   | "Invalid credentials"             |
| Rate limit exceeded     | 429         | `rate_limit`     | "Too many requests"               |
| AI provider error       | 500         | `ai_error`       | "Failed to generate response"     |
| Missing API key         | 500         | `config_error`   | "Service configuration error"     |
| Request timeout         | 504         | `timeout`        | "Request timed out"               |

### Error Response Format

```typescript
{
  "error": "Human readable message",
  "code": "error_code",
  "status": 400
}
```

## Testing Strategy

### Unit Testing

- Use Vitest for unit tests
- Test validation functions with various input combinations
- Test message transformation functions
- Test error handling utilities
- Mock AI provider for isolated testing

### Property-Based Testing

- Use fast-check library for property-based tests
- Minimum 100 iterations per property test
- Tag each test with: **Feature: ai-chat-api, Property {number}: {property_text}**

### Test Coverage Focus

1. **Request Validation**: Test schema validation with valid/invalid inputs
2. **Message Transformation**: Test UI message to model message conversion
3. **Context Truncation**: Test message array truncation logic
4. **Error Responses**: Test error formatting and status codes

### Integration Testing

- Test full request/response cycle with mocked AI provider
- Test streaming response format
- Test authentication flow
