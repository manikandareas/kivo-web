import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import * as fc from 'fast-check';
import { ChatInput } from '../chat-input';

afterEach(() => {
  cleanup();
});

/**
 * **Feature: ai-chat-landing, Property 1: Chat input accepts multi-line text**
 * *For any* string input including newline characters, the ChatInput component
 * SHALL accept and display the complete text without truncation or modification.
 * **Validates: Requirements 2.3**
 */
describe('Property 1: Chat input accepts multi-line text', () => {
  it('should accept and display any string including newlines without modification', () => {
    fc.assert(
      fc.property(fc.string(), (inputText) => {
        cleanup();

        const onChange = vi.fn();
        const onSend = vi.fn();

        // Render with the value directly to test display
        const { unmount } = render(
          <ChatInput value={inputText} onChange={onChange} onSend={onSend} />
        );

        const textarea = screen.getByTestId(
          'chat-input-textarea'
        ) as HTMLTextAreaElement;

        // Property: The textarea displays the exact value without modification
        expect(textarea.value).toBe(inputText);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should pass input changes to onChange handler without modification', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }), // Non-empty strings to ensure change event fires
        (inputText) => {
          cleanup();

          const onChange = vi.fn();
          const onSend = vi.fn();

          const { unmount } = render(
            <ChatInput value="" onChange={onChange} onSend={onSend} />
          );

          const textarea = screen.getByTestId(
            'chat-input-textarea'
          ) as HTMLTextAreaElement;

          // Simulate typing the input
          fireEvent.change(textarea, { target: { value: inputText } });

          // Property: onChange receives the exact input without modification
          expect(onChange).toHaveBeenCalledWith(inputText);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should specifically handle multi-line text with newlines', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string(), { minLength: 1, maxLength: 10 }),
        (lines) => {
          cleanup();

          const multiLineText = lines.join('\n');
          const onChange = vi.fn();
          const onSend = vi.fn();

          const { unmount } = render(
            <ChatInput
              value={multiLineText}
              onChange={onChange}
              onSend={onSend}
            />
          );

          const textarea = screen.getByTestId(
            'chat-input-textarea'
          ) as HTMLTextAreaElement;

          // Property: The textarea displays multi-line text correctly
          expect(textarea.value).toBe(multiLineText);

          // Property: Newlines are preserved
          const newlineCount = (multiLineText.match(/\n/g) || []).length;
          const displayedNewlineCount = (textarea.value.match(/\n/g) || [])
            .length;
          expect(displayedNewlineCount).toBe(newlineCount);

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: ai-chat-landing, Property 2: Send action invocation**
 * *For any* non-empty input value, when the Send_Button is clicked,
 * the onSend callback SHALL be invoked exactly once.
 * **Validates: Requirements 2.5**
 */
describe('Property 2: Send action invocation', () => {
  it('should invoke onSend exactly once when send button is clicked', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (inputText) => {
        cleanup();

        const onChange = vi.fn();
        const onSend = vi.fn();

        const { unmount } = render(
          <ChatInput value={inputText} onChange={onChange} onSend={onSend} />
        );

        const sendButton = screen.getByTestId('chat-input-send-button');

        // Click the send button
        fireEvent.click(sendButton);

        // Property: onSend is called exactly once
        expect(onSend).toHaveBeenCalledTimes(1);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should invoke onSend when Enter is pressed without Shift', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (inputText) => {
        cleanup();

        const onChange = vi.fn();
        const onSend = vi.fn();

        const { unmount } = render(
          <ChatInput value={inputText} onChange={onChange} onSend={onSend} />
        );

        const textarea = screen.getByTestId('chat-input-textarea');

        // Press Enter without Shift
        fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false });

        // Property: onSend is called exactly once
        expect(onSend).toHaveBeenCalledTimes(1);

        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should NOT invoke onSend when Shift+Enter is pressed (allows newline)', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (inputText) => {
        cleanup();

        const onChange = vi.fn();
        const onSend = vi.fn();

        const { unmount } = render(
          <ChatInput value={inputText} onChange={onChange} onSend={onSend} />
        );

        const textarea = screen.getByTestId('chat-input-textarea');

        // Press Shift+Enter (should allow newline, not send)
        fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });

        // Property: onSend should NOT be called
        expect(onSend).not.toHaveBeenCalled();

        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
