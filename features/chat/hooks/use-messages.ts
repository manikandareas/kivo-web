'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * useMessages hook
 * Manages scroll position tracking and auto-scroll behavior for chat messages
 *
 * Requirements: 3.4, 3.5
 */
export function useMessages() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  /**
   * Check if the scroll position is at the bottom
   */
  const checkIsAtBottom = useCallback(() => {
    const container = containerRef.current;
    if (!container) return true;

    const threshold = 50; // pixels from bottom to consider "at bottom"
    const { scrollTop, scrollHeight, clientHeight } = container;
    return scrollHeight - scrollTop - clientHeight <= threshold;
  }, []);

  /**
   * Scroll to the bottom of the messages container
   */
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior,
    });
  }, []);

  /**
   * Handle scroll events to track position
   */
  const handleScroll = useCallback(() => {
    setIsAtBottom(checkIsAtBottom());
  }, [checkIsAtBottom]);

  /**
   * Set up scroll event listener
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return {
    containerRef,
    isAtBottom,
    scrollToBottom,
    checkIsAtBottom,
  };
}
