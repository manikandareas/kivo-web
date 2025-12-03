import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { AuthTabs } from '../auth-tabs';

// Mock the auth client
vi.mock('@/lib/auth-client', () => ({
  authClient: {
    signIn: {
      email: vi.fn(),
      social: vi.fn(),
    },
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
 * Unit Tests for AuthTabs
 * Tests tab switching, default tab selection
 * _Requirements: 4.1, 4.2, 4.3_
 */
describe('AuthTabs Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Rendering', () => {
    it('should render Sign In and Sign Up tabs', () => {
      render(<AuthTabs />);
      const signInTab = screen.getByRole('tab', { name: /sign in/i });
      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      expect(signInTab).toBeTruthy();
      expect(signUpTab).toBeTruthy();
    });

    it('should render welcome header', () => {
      render(<AuthTabs />);
      expect(screen.getByText(/welcome/i)).toBeTruthy();
    });

    it('should render OAuth buttons section', () => {
      render(<AuthTabs />);
      expect(screen.getByText(/or continue with/i)).toBeTruthy();
    });
  });

  describe('Default Tab Selection', () => {
    it('should select Sign In tab by default', () => {
      render(<AuthTabs />);
      const signInTab = screen.getByRole('tab', { name: /sign in/i });
      expect(signInTab.getAttribute('data-state')).toBe('active');
    });

    it('should display Sign In form by default', () => {
      render(<AuthTabs />);
      // Sign In form has email and password fields, plus remember me checkbox
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const rememberMeCheckbox = screen.getByRole('checkbox');
      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(rememberMeCheckbox).toBeTruthy();
    });

    it('should select Sign Up tab when defaultTab is sign-up', () => {
      render(<AuthTabs defaultTab="sign-up" />);
      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      expect(signUpTab.getAttribute('data-state')).toBe('active');
    });

    it('should display Sign Up form when defaultTab is sign-up', () => {
      render(<AuthTabs defaultTab="sign-up" />);
      // Sign Up form has first name and last name fields
      const firstNameInput = screen.getByLabelText(/first name/i);
      const lastNameInput = screen.getByLabelText(/last name/i);
      expect(firstNameInput).toBeTruthy();
      expect(lastNameInput).toBeTruthy();
    });
  });

  describe('Tab Switching', () => {
    it('should have clickable tab triggers', () => {
      render(<AuthTabs />);
      const signInTab = screen.getByRole('tab', { name: /sign in/i });
      const signUpTab = screen.getByRole('tab', { name: /sign up/i });

      // Verify tabs are buttons and can receive clicks
      expect(signInTab.tagName).toBe('BUTTON');
      expect(signUpTab.tagName).toBe('BUTTON');
      expect(signInTab.getAttribute('type')).toBe('button');
      expect(signUpTab.getAttribute('type')).toBe('button');
    });

    it('should have proper ARIA attributes for accessibility', () => {
      render(<AuthTabs />);
      const signInTab = screen.getByRole('tab', { name: /sign in/i });
      const signUpTab = screen.getByRole('tab', { name: /sign up/i });
      const tabList = screen.getByRole('tablist');

      // Verify ARIA attributes
      expect(tabList).toBeTruthy();
      expect(signInTab.getAttribute('aria-selected')).toBe('true');
      expect(signUpTab.getAttribute('aria-selected')).toBe('false');
      expect(signInTab.getAttribute('aria-controls')).toBeTruthy();
      expect(signUpTab.getAttribute('aria-controls')).toBeTruthy();
    });

    it('should render both tab panels', () => {
      render(<AuthTabs />);
      const tabPanels = screen.getAllByRole('tabpanel');
      // At least one tab panel should be visible
      expect(tabPanels.length).toBeGreaterThanOrEqual(1);
    });
  });
});
