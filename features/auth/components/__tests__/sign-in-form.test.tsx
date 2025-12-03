import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import * as fc from 'fast-check';
import { SignInForm } from '../sign-in-form';

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
    },
  },
}));

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>,
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Unit Tests for SignInForm
 * Tests form rendering, field interactions, error states
 * _Requirements: 1.1, 1.2, 1.4_
 */
describe('SignInForm Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render email input field', () => {
      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeTruthy();
      expect(emailInput.getAttribute('type')).toBe('email');
    });

    it('should render password input field', () => {
      render(<SignInForm />);
      const passwordInput = screen.getByLabelText(/password/i);
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.getAttribute('type')).toBe('password');
    });

    it('should render remember me checkbox', () => {
      render(<SignInForm />);
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeTruthy();
    });

    it('should render forgot password link', () => {
      render(<SignInForm />);
      const link = screen.getByText(/forgot password/i);
      expect(link).toBeTruthy();
      expect(link.getAttribute('href')).toBe('/forgot-password');
    });

    it('should render sign in button', () => {
      render(<SignInForm />);
      const button = screen.getByRole('button', { name: /sign in/i });
      expect(button).toBeTruthy();
    });
  });

  describe('Field Interactions', () => {
    it('should update email field value on change', () => {
      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      expect(emailInput.value).toBe('test@example.com');
    });

    it('should update password field value on change', () => {
      render(<SignInForm />);
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'mypassword123' } });
      expect(passwordInput.value).toBe('mypassword123');
    });

    it('should toggle remember me checkbox on click', () => {
      render(<SignInForm />);
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.getAttribute('data-state')).toBe('unchecked');
      fireEvent.click(checkbox);
      expect(checkbox.getAttribute('data-state')).toBe('checked');
    });
  });

  describe('Error States', () => {
    it('should show error toast when authentication fails', async () => {
      const { authClient } = await import('@/lib/auth-client');
      const toast = await import('react-hot-toast');

      vi.mocked(authClient.signIn.email).mockImplementation(
        async (_params, callbacks) => {
          callbacks?.onError?.({
            error: { message: 'Invalid credentials' },
          } as never);
          return { data: null, error: { message: 'Invalid credentials' } };
        }
      );

      render(<SignInForm />);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.default.error).toHaveBeenCalledWith('Invalid credentials');
      });
    });
  });
});

/**
 * **Feature: authentication, Property 1: Loading State Disables Interaction**
 * *For any* authentication form (sign-in or sign-up), when the form is in loading state,
 * the submit button SHALL be disabled and display a loading indicator.
 * **Validates: Requirements 1.4, 2.4, 5.3**
 */
describe('Property 1: Loading State Disables Interaction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should disable submit button and show loading indicator during form submission', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data using fast-check
    const testCases = fc.sample(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string({ minLength: 1 }),
      }),
      100
    );

    for (const { email, password } of testCases) {
      cleanup();
      vi.clearAllMocks();

      // Create a promise that we can control to simulate loading state
      let resolveSignIn: () => void;
      const signInPromise = new Promise<void>((resolve) => {
        resolveSignIn = resolve;
      });

      // Mock signIn.email to return a pending promise
      vi.mocked(authClient.signIn.email).mockImplementation(async () => {
        await signInPromise;
        return { data: null, error: null };
      });

      const { unmount } = render(<SignInForm />);

      // Fill in the form
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      }) as HTMLButtonElement;

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });

      // Property: Before submission, button should be enabled
      expect(submitButton.disabled).toBe(false);

      // Submit the form
      fireEvent.click(submitButton);

      // Property: During loading, button should be disabled
      await waitFor(() => {
        expect(submitButton.disabled).toBe(true);
      });

      // Property: During loading, button should show loading indicator text
      expect(screen.queryByText(/signing in/i)).not.toBeNull();

      // Resolve the promise to complete the test
      resolveSignIn!();

      unmount();
    }
  });

  it('should disable all form inputs during loading state', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data using fast-check
    const testCases = fc.sample(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string({ minLength: 1 }),
      }),
      100
    );

    for (const { email, password } of testCases) {
      cleanup();
      vi.clearAllMocks();

      let resolveSignIn: () => void;
      const signInPromise = new Promise<void>((resolve) => {
        resolveSignIn = resolve;
      });

      vi.mocked(authClient.signIn.email).mockImplementation(async () => {
        await signInPromise;
        return { data: null, error: null };
      });

      const { unmount } = render(<SignInForm />);

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;
      const rememberMeCheckbox = screen.getByRole(
        'checkbox'
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      }) as HTMLButtonElement;

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });

      // Submit the form
      fireEvent.click(submitButton);

      // Property: All inputs should be disabled during loading
      await waitFor(() => {
        expect(emailInput.disabled).toBe(true);
        expect(passwordInput.disabled).toBe(true);
        expect(rememberMeCheckbox.disabled).toBe(true);
      });

      resolveSignIn!();

      unmount();
    }
  }, 60000);
});

/**
 * **Feature: authentication, Property 3: Sign In Parameters Correctness**
 * *For any* valid sign-in form submission with email, password, and rememberMe values,
 * the signIn.email function SHALL be called with those exact parameter values.
 * **Validates: Requirements 1.1, 1.3**
 */
describe('Property 3: Sign In Parameters Correctness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call signIn.email with exact email, password, and rememberMe values', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data using fast-check
    const testCases = fc.sample(
      fc.record({
        email: fc.emailAddress(),
        password: fc.string({ minLength: 1 }),
        rememberMe: fc.boolean(),
      }),
      100
    );

    for (const { email, password, rememberMe } of testCases) {
      cleanup();
      vi.clearAllMocks();

      // Mock signIn.email to resolve immediately
      vi.mocked(authClient.signIn.email).mockImplementation(
        async (_params, callbacks) => {
          callbacks?.onSuccess?.({ data: null } as never);
          return { data: null, error: null };
        }
      );

      const { unmount } = render(<SignInForm />);

      // Fill in the form
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /password/i
      ) as HTMLInputElement;
      const rememberMeCheckbox = screen.getByRole(
        'checkbox'
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign in/i,
      }) as HTMLButtonElement;

      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });

      // Set rememberMe checkbox based on test data
      const checkboxState = rememberMeCheckbox.getAttribute('data-state');
      if (rememberMe && checkboxState === 'unchecked') {
        fireEvent.click(rememberMeCheckbox);
      } else if (!rememberMe && checkboxState === 'checked') {
        fireEvent.click(rememberMeCheckbox);
      }

      // Submit the form
      fireEvent.click(submitButton);

      // Wait for the async operation
      await waitFor(() => {
        expect(authClient.signIn.email).toHaveBeenCalledTimes(1);
      });

      // Property: signIn.email should be called with exact parameter values
      const callArgs = vi.mocked(authClient.signIn.email).mock.calls[0][0];
      expect(callArgs.email).toBe(email);
      expect(callArgs.password).toBe(password);
      expect(callArgs.rememberMe).toBe(rememberMe);

      unmount();
    }
  }, 60000);
});
