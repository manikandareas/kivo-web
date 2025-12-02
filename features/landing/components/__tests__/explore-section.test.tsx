import { describe, it, expect, vi, afterEach, beforeAll } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ExploreSection } from '../explore-section';
import type { Idea } from '../../types';

// Mock IntersectionObserver for framer-motion whileInView
class MockIntersectionObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor() {}
}

beforeAll(() => {
  global.IntersectionObserver =
    MockIntersectionObserver as unknown as typeof IntersectionObserver;
});

afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid Idea objects
const ideaArbitrary = fc.record({
  id: fc.uuid(),
  title: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
  icon: fc.option(fc.string(), { nil: undefined }),
  category: fc.option(fc.string(), { nil: undefined }),
});

/**
 * **Feature: ai-chat-landing, Property 3: Idea cards rendering completeness**
 * *For any* array of Idea objects passed to ExploreSection, the component SHALL
 * render exactly one IdeaCard for each Idea in the array, maintaining the same count.
 * **Validates: Requirements 4.2**
 */
describe('Property 3: Idea cards rendering completeness', () => {
  it('should render exactly one IdeaCard for each Idea in the array', () => {
    fc.assert(
      fc.property(
        fc.array(ideaArbitrary, { minLength: 1, maxLength: 20 }),
        (ideas: Idea[]) => {
          cleanup();

          const onIdeaClick = vi.fn();

          const { unmount } = render(
            <ExploreSection ideas={ideas} onIdeaClick={onIdeaClick} />
          );

          // Get all rendered IdeaCards
          const ideaCards = screen.getAllByTestId('idea-card');

          // Property: The number of rendered cards equals the number of ideas
          // Note: We render cards in both desktop grid and mobile scroll views,
          // so we expect 2x the number of ideas (one set for each viewport)
          expect(ideaCards.length).toBe(ideas.length * 2);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should render empty state when ideas array is empty', () => {
    cleanup();

    const onIdeaClick = vi.fn();

    render(<ExploreSection ideas={[]} onIdeaClick={onIdeaClick} />);

    // Should show empty state message
    expect(screen.getByText('Belum ada ide tersedia.')).toBeTruthy();

    // Should not render any IdeaCards
    expect(screen.queryAllByTestId('idea-card')).toHaveLength(0);
  });

  it('should render all idea titles correctly for any array of ideas', () => {
    fc.assert(
      fc.property(
        fc.array(ideaArbitrary, { minLength: 1, maxLength: 10 }),
        (ideas: Idea[]) => {
          cleanup();

          const onIdeaClick = vi.fn();

          const { unmount } = render(
            <ExploreSection ideas={ideas} onIdeaClick={onIdeaClick} />
          );

          // Get all rendered titles
          const titles = screen.getAllByTestId('idea-card-title');

          // Property: Each idea title appears exactly twice (desktop + mobile)
          for (const idea of ideas) {
            const matchingTitles = titles.filter(
              (t) => t.textContent === idea.title
            );
            expect(matchingTitles.length).toBe(2);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
