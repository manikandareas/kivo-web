import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { IdeaCard } from '../idea-card';
import type { Idea } from '../../types';

afterEach(() => {
  cleanup();
});

// Arbitrary for generating valid Idea objects
const ideaArbitrary = fc.record({
  id: fc.string({ minLength: 1 }),
  title: fc.string({ minLength: 1 }),
  description: fc.option(fc.string(), { nil: undefined }),
  icon: fc.option(fc.string(), { nil: undefined }),
  category: fc.option(fc.string(), { nil: undefined }),
});

/**
 * **Feature: ai-chat-landing, Property 4: Idea card click handling**
 * *For any* IdeaCard, when clicked, the onClick callback SHALL be invoked
 * with the corresponding Idea object.
 * **Validates: Requirements 4.5**
 */
describe('Property 4: Idea card click handling', () => {
  it('should invoke onClick exactly once when the card is clicked', () => {
    fc.assert(
      fc.property(ideaArbitrary, (idea: Idea) => {
        cleanup();

        const onClick = vi.fn();

        const { unmount } = render(<IdeaCard idea={idea} onClick={onClick} />);

        const card = screen.getByTestId('idea-card');

        // Click the card
        fireEvent.click(card);

        // Property: onClick is called exactly once
        expect(onClick).toHaveBeenCalledTimes(1);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render the idea title correctly for any idea', () => {
    fc.assert(
      fc.property(ideaArbitrary, (idea: Idea) => {
        cleanup();

        const onClick = vi.fn();

        const { unmount } = render(<IdeaCard idea={idea} onClick={onClick} />);

        const title = screen.getByTestId('idea-card-title');

        // Property: The title displays the exact idea title
        expect(title.textContent).toBe(idea.title);

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
