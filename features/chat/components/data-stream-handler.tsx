'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';

/**
 * Stream data types that can be received from AI response
 */
export interface StreamData {
  type: 'text' | 'reasoning' | 'tool-call' | 'tool-result' | 'error';
  content: string;
  metadata?: Record<string, unknown>;
}

/**
 * Data stream state
 */
export interface DataStreamState {
  /** Whether the stream is currently active */
  isStreaming: boolean;
  /** Current stream data chunks */
  streamData: StreamData[];
  /** Any error that occurred during streaming */
  error: Error | null;
}

/**
 * Data stream context value
 */
export interface DataStreamContextValue extends DataStreamState {
  /** Add new stream data */
  addStreamData: (data: StreamData) => void;
  /** Clear all stream data */
  clearStreamData: () => void;
  /** Set streaming state */
  setIsStreaming: (isStreaming: boolean) => void;
  /** Set error state */
  setError: (error: Error | null) => void;
  /** Reset all state */
  reset: () => void;
}

const initialState: DataStreamState = {
  isStreaming: false,
  streamData: [],
  error: null,
};

const DataStreamContext = createContext<DataStreamContextValue | null>(null);

/**
 * DataStreamProvider props
 */
export interface DataStreamProviderProps {
  children: ReactNode;
}

/**
 * DataStreamProvider
 * Provides context for managing streaming data from AI responses
 *
 * Requirements: 2.4, 5.2
 */
export function DataStreamProvider({ children }: DataStreamProviderProps) {
  const [state, setState] = useState<DataStreamState>(initialState);

  const addStreamData = useCallback((data: StreamData) => {
    setState((prev) => ({
      ...prev,
      streamData: [...prev.streamData, data],
    }));
  }, []);

  const clearStreamData = useCallback(() => {
    setState((prev) => ({
      ...prev,
      streamData: [],
    }));
  }, []);

  const setIsStreaming = useCallback((isStreaming: boolean) => {
    setState((prev) => ({
      ...prev,
      isStreaming,
    }));
  }, []);

  const setError = useCallback((error: Error | null) => {
    setState((prev) => ({
      ...prev,
      error,
    }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const value: DataStreamContextValue = {
    ...state,
    addStreamData,
    clearStreamData,
    setIsStreaming,
    setError,
    reset,
  };

  return (
    <DataStreamContext.Provider value={value}>
      {children}
    </DataStreamContext.Provider>
  );
}

/**
 * useDataStream hook
 * Access the data stream context
 *
 * @throws Error if used outside of DataStreamProvider
 */
export function useDataStream(): DataStreamContextValue {
  const context = useContext(DataStreamContext);

  if (!context) {
    throw new Error('useDataStream must be used within a DataStreamProvider');
  }

  return context;
}

/**
 * DataStreamHandler component props
 */
export interface DataStreamHandlerProps {
  /** Callback when new stream data is received */
  onStreamData?: (data: StreamData) => void;
  /** Callback when streaming starts */
  onStreamStart?: () => void;
  /** Callback when streaming ends */
  onStreamEnd?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * DataStreamHandler component
 * Handles streaming data from AI response and manages stream state
 * Uses DataStreamProvider context to share state across components
 *
 * Requirements: 2.4, 5.2
 */
export function DataStreamHandler({
  onStreamData,
  onStreamStart,
  onStreamEnd,
  onError,
}: DataStreamHandlerProps) {
  const { addStreamData, setIsStreaming, setError, clearStreamData } =
    useDataStream();

  /**
   * Handle incoming stream data
   */
  const handleStreamData = useCallback(
    (data: StreamData) => {
      addStreamData(data);
      onStreamData?.(data);
    },
    [addStreamData, onStreamData]
  );

  /**
   * Handle stream start
   */
  const handleStreamStart = useCallback(() => {
    clearStreamData();
    setIsStreaming(true);
    onStreamStart?.();
  }, [clearStreamData, setIsStreaming, onStreamStart]);

  /**
   * Handle stream end
   */
  const handleStreamEnd = useCallback(() => {
    setIsStreaming(false);
    onStreamEnd?.();
  }, [setIsStreaming, onStreamEnd]);

  /**
   * Handle stream error
   */
  const handleStreamError = useCallback(
    (error: Error) => {
      setError(error);
      setIsStreaming(false);
      onError?.(error);
    },
    [setError, setIsStreaming, onError]
  );

  // Expose handlers for external use (e.g., from useChat callbacks)
  // These are typically called from the parent component that manages the AI SDK
  return {
    handleStreamData,
    handleStreamStart,
    handleStreamEnd,
    handleStreamError,
  };
}

// Re-export for convenience
export { DataStreamContext };
