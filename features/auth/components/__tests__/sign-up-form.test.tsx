import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import * as fc from 'fast-check';
import { SignUpForm } from '../sign-up-form';

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signUp: {
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

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/**
 * Unit Tests for SignUpForm
 * Tests form rendering, validation, error states
 * _Requirements: 2.1, 2.2, 2.4_
 */
describe('SignUpForm Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('should render first name input field', () => {
      render(<SignUpForm />);
      const firstNameInput = screen.getByLabelText(/first name/i);
      expect(firstNameInput).toBeTruthy();
      expect(firstNameInput.getAttribute('type')).toBe('text');
    });

    it('should render last name input field', () => {
      render(<SignUpForm />);
      const lastNameInput = screen.getByLabelText(/last name/i);
      expect(lastNameInput).toBeTruthy();
      expect(lastNameInput.getAttribute('type')).toBe('text');
    });

    it('should render email input field', () => {
      render(<SignUpForm />);
      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toBeTruthy();
      expect(emailInput.getAttribute('type')).toBe('email');
    });

    it('should render password input field', () => {
      render(<SignUpForm />);
      const passwordInput = screen.getByLabelText(/^password$/i);
      expect(passwordInput).toBeTruthy();
      expect(passwordInput.getAttribute('type')).toBe('password');
    });

    it('should render confirm password input field', () => {
      render(<SignUpForm />);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      expect(confirmInput).toBeTruthy();
      expect(confirmInput.getAttribute('type')).toBe('password');
    });

    it('should render sign up button', () => {
      render(<SignUpForm />);
      const button = screen.getByRole('button', { name: /sign up/i });
      expect(button).toBeTruthy();
    });
  });

  describe('Field Interactions', () => {
    it('should update first name field value on change', () => {
      render(<SignUpForm />);
      const firstNameInput = screen.getByLabelText(
        /first name/i
      ) as HTMLInputElement;
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      expect(firstNameInput.value).toBe('John');
    });

    it('should update last name field value on change', () => {
      render(<SignUpForm />);
      const lastNameInput = screen.getByLabelText(
        /last name/i
      ) as HTMLInputElement;
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      expect(lastNameInput.value).toBe('Doe');
    });

    it('should update email field value on change', () => {
      render(<SignUpForm />);
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      expect(emailInput.value).toBe('john@example.com');
    });

    it('should update password field value on change', () => {
      render(<SignUpForm />);
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(passwordInput.value).toBe('password123');
    });

    it('should update confirm password field value on change', () => {
      render(<SignUpForm />);
      const confirmInput = screen.getByLabelText(
        /confirm password/i
      ) as HTMLInputElement;
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      expect(confirmInput.value).toBe('password123');
    });
  });

  describe('Validation', () => {
    it('should display error when passwords do not match', async () => {
      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, {
        target: { value: 'differentpassword' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeTruthy();
      });
    });

    it('should clear password error when confirm password is changed', async () => {
      render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, {
        target: { value: 'differentpassword' },
      });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeTruthy();
      });

      // Change confirm password to clear error
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      expect(screen.queryByText(/passwords do not match/i)).toBeNull();
    });
  });

  describe('Error States', () => {
    it('should show error toast when registration fails', async () => {
      const { authClient } = await import('@/lib/auth-client');
      const toast = await import('react-hot-toast');

      vi.mocked(authClient.signUp.email).mockImplementation(
        async (_params, callbacks) => {
          callbacks?.onError?.({
            error: { message: 'Email already exists' },
          } as never);
          return { data: null, error: { message: 'Email already exists' } };
        }
      );

      render(<SignUpForm />);
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(toast.default.error).toHaveBeenCalledWith(
          'Email already exists'
        );
      });
    });

    it('should disable all inputs during loading state', async () => {
      const { authClient } = await import('@/lib/auth-client');

      let resolveSignUp: () => void;
      const signUpPromise = new Promise<void>((resolve) => {
        resolveSignUp = resolve;
      });

      vi.mocked(authClient.signUp.email).mockImplementation(async () => {
        await signUpPromise;
        return { data: null, error: null };
      });

      render(<SignUpForm />);
      const firstNameInput = screen.getByLabelText(
        /first name/i
      ) as HTMLInputElement;
      const lastNameInput = screen.getByLabelText(
        /last name/i
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(
        /confirm password/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign up/i,
      }) as HTMLButtonElement;

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.change(confirmInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(firstNameInput.disabled).toBe(true);
        expect(lastNameInput.disabled).toBe(true);
        expect(emailInput.disabled).toBe(true);
        expect(passwordInput.disabled).toBe(true);
        expect(confirmInput.disabled).toBe(true);
        expect(submitButton.disabled).toBe(true);
      });

      resolveSignUp!();
    });
  });
});

/**
 * **Feature: authentication, Property 2: Password Confirmation Validation**
 * *For any* two strings where password !== passwordConfirmation, the sign-up form
 * validation SHALL reject the submission and display an error message.
 * **Validates: Requirements 2.2**
 */
describe('Property 2: Password Confirmation Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should reject submission and display error when password !== passwordConfirmation', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data: pairs of different passwords
    const testCases = fc.sample(
      fc
        .record({
          firstName: fc
            .string({ minLength: 1 })
            .filter((s) => s.trim().length > 0),
          lastName: fc
            .string({ minLength: 1 })
            .filter((s) => s.trim().length > 0),
          email: fc.emailAddress(),
          password: fc.string({ minLength: 1 }),
          passwordConfirmation: fc.string({ minLength: 1 }),
        })
        .filter((data) => data.password !== data.passwordConfirmation),
      100
    );

    for (const {
      firstName,
      lastName,
      email,
      password,
      passwordConfirmation,
    } of testCases) {
      cleanup();
      vi.clearAllMocks();

      const { unmount } = render(<SignUpForm />);

      // Fill in the form
      const firstNameInput = screen.getByLabelText(
        /first name/i
      ) as HTMLInputElement;
      const lastNameInput = screen.getByLabelText(
        /last name/i
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(
        /confirm password/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign up/i,
      }) as HTMLButtonElement;

      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.change(confirmInput, {
        target: { value: passwordConfirmation },
      });

      // Submit the form
      fireEvent.click(submitButton);

      // Property: When passwords don't match, form should NOT call signUp.email
      await waitFor(() => {
        expect(authClient.signUp.email).not.toHaveBeenCalled();
      });

      // Property: Error message should be displayed
      expect(screen.getByText(/passwords do not match/i)).toBeTruthy();

      unmount();
    }
  });

  it('should accept submission when password === passwordConfirmation', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data: matching passwords
    const testCases = fc.sample(
      fc.record({
        firstName: fc
          .string({ minLength: 1 })
          .filter((s) => s.trim().length > 0),
        lastName: fc
          .string({ minLength: 1 })
          .filter((s) => s.trim().length > 0),
        email: fc.emailAddress(),
        password: fc.string({ minLength: 1 }),
      }),
      100
    );

    for (const { firstName, lastName, email, password } of testCases) {
      cleanup();
      vi.clearAllMocks();

      vi.mocked(authClient.signUp.email).mockImplementation(
        async (_params, callbacks) => {
          callbacks?.onSuccess?.({ data: null } as never);
          return { data: null, error: null };
        }
      );

      const { unmount } = render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(
        /first name/i
      ) as HTMLInputElement;
      const lastNameInput = screen.getByLabelText(
        /last name/i
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(
        /confirm password/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign up/i,
      }) as HTMLButtonElement;

      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      // Use same password for confirmation
      fireEvent.change(confirmInput, { target: { value: password } });

      fireEvent.click(submitButton);

      // Property: When passwords match, signUp.email should be called
      await waitFor(() => {
        expect(authClient.signUp.email).toHaveBeenCalled();
      });

      // Property: No error message should be displayed
      expect(screen.queryByText(/passwords do not match/i)).toBeNull();

      unmount();
    }
  });
});

/**
 * **Feature: authentication, Property 4: Sign Up Parameters Correctness**
 * *For any* valid sign-up form submission with firstName, lastName, email, and password,
 * the signUp.email function SHALL be called with name as concatenation of firstName and lastName,
 * and the provided email and password.
 * **Validates: Requirements 2.1**
 */
describe('Property 4: Sign Up Parameters Correctness', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call signUp.email with correct name concatenation, email, and password', async () => {
    const { authClient } = await import('@/lib/auth-client');

    // Generate test data
    const testCases = fc.sample(
      fc.record({
        firstName: fc
          .string({ minLength: 1 })
          .filter((s) => s.trim().length > 0),
        lastName: fc
          .string({ minLength: 1 })
          .filter((s) => s.trim().length > 0),
        email: fc.emailAddress(),
        password: fc.string({ minLength: 1 }),
      }),
      100
    );

    for (const { firstName, lastName, email, password } of testCases) {
      cleanup();
      vi.clearAllMocks();

      vi.mocked(authClient.signUp.email).mockImplementation(
        async (_params, callbacks) => {
          callbacks?.onSuccess?.({ data: null } as never);
          return { data: null, error: null };
        }
      );

      const { unmount } = render(<SignUpForm />);

      const firstNameInput = screen.getByLabelText(
        /first name/i
      ) as HTMLInputElement;
      const lastNameInput = screen.getByLabelText(
        /last name/i
      ) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const passwordInput = screen.getByLabelText(
        /^password$/i
      ) as HTMLInputElement;
      const confirmInput = screen.getByLabelText(
        /confirm password/i
      ) as HTMLInputElement;
      const submitButton = screen.getByRole('button', {
        name: /sign up/i,
      }) as HTMLButtonElement;

      fireEvent.change(firstNameInput, { target: { value: firstName } });
      fireEvent.change(lastNameInput, { target: { value: lastName } });
      fireEvent.change(emailInput, { target: { value: email } });
      fireEvent.change(passwordInput, { target: { value: password } });
      fireEvent.change(confirmInput, { target: { value: password } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(authClient.signUp.email).toHaveBeenCalledTimes(1);
      });

      // Property: signUp.email should be called with correct parameters
      const callArgs = vi.mocked(authClient.signUp.email).mock.calls[0][0];

      // Property: name should be concatenation of firstName and lastName
      expect(callArgs.name).toBe(`${firstName} ${lastName}`);

      // Property: email should match input
      expect(callArgs.email).toBe(email);

      // Property: password should match input
      expect(callArgs.password).toBe(password);

      // Property: image should be a DiceBear URL with the name as seed
      expect(callArgs.image).toContain(
        'https://api.dicebear.com/9.x/open-peeps/svg?seed='
      );
      expect(callArgs.image).toContain(
        encodeURIComponent(`${firstName} ${lastName}`)
      );

      unmount();
    }
  }, 60000);
});
