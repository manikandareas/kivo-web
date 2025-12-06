/**
 * Chat feature public exports
 */

// Components
export {
  Chat,
  ChatInput,
  ChatHistory,
  HomeChatForm,
  Message,
  Messages,
  ThinkingMessage,
  DataStreamProvider,
  DataStreamHandler,
  useDataStream,
  DataStreamContext,
  type ChatProps,
  type ChatInputProps,
  type HomeChatFormProps,
  type MessageProps,
  type MessagesProps,
  type ChatStatus,
  type DataStreamProviderProps,
  type DataStreamHandlerProps,
  type DataStreamState,
  type DataStreamContextValue,
  type StreamData,
  LocationPermissionModal,
  type LocationPermissionModalProps,
} from './components';

// Hooks
export { useMessages, useGeolocation, type GeolocationState } from './hooks';

// Types
export type {
  ChatMessage,
  ChatMessageWithParts,
  MessagePart,
  VisibilityType,
  Chat as ChatSession,
  ChatModel,
} from './types';
