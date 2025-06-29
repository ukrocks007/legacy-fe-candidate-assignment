import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAuth } from '../contexts/AuthContext';
import { render, mockUseDynamicContext, mockUseAuth } from '../test/utils';
import Profile from './Profile';

// Mock the components that are imported
vi.mock('../components/MFASetup', () => ({
  default: () => <div data-testid='mfa-setup'>MFA Setup Component</div>,
}));

describe('Profile Component', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Reset localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Reset alert mock
    global.alert = vi.fn();
  });

  describe('Rendering', () => {
    it('should render the profile page with all main sections', () => {
      // Mock the hooks to return authenticated state
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // Check for main sections
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Manage your account settings and security preferences'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Authentication Status')).toBeInTheDocument();
      expect(screen.getByText('Account Information')).toBeInTheDocument();
      expect(screen.getByText('Account Actions')).toBeInTheDocument();
    });

    it('should render profile header with correct icon and text', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      const profileHeader = screen.getByText('Profile Settings');
      expect(profileHeader).toBeInTheDocument();
      expect(profileHeader.tagName).toBe('SPAN');
      expect(profileHeader.className).toContain('text-xl font-bold');
    });

    it('should include MFA Setup component', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByTestId('mfa-setup')).toBeInTheDocument();
    });
  });

  describe('Authentication Status', () => {
    it('should show authenticated status when backend auth is active', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(
        screen.getByText('Backend Authentication Active')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'You are authenticated with the backend and can access all features.'
        )
      ).toBeInTheDocument();
      expect(screen.getByText('Backend User ID:')).toBeInTheDocument();
      expect(screen.getByText('backend-user-id')).toBeInTheDocument();
    });

    it('should show wallet-only status when backend auth is not active', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue({
        ...mockUseAuth,
        isAuthenticated: false,
        user: null,
      });

      render(<Profile />);

      expect(screen.getByText('Wallet Connected Only')).toBeInTheDocument();
      expect(
        screen.getByText(
          'You need to authenticate with the backend to access all features.'
        )
      ).toBeInTheDocument();
      expect(screen.queryByText('Backend User ID:')).not.toBeInTheDocument();
    });

    it('should not show backend user ID when user is null', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue({
        ...mockUseAuth,
        user: null,
      });

      render(<Profile />);

      expect(screen.queryByText('Backend User ID:')).not.toBeInTheDocument();
    });
  });

  describe('Account Information', () => {
    it('should display wallet address correctly', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByText('Wallet Address')).toBeInTheDocument();
      expect(
        screen.getByText('0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10')
      ).toBeInTheDocument();
    });

    it('should display wallet type correctly', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByText('Wallet Type')).toBeInTheDocument();
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
    });

    it('should display wallet chain correctly', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByText('Wallet Chain')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument();
    });

    it('should display email when available', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByText('Email (Dynamic.xyz)')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should not display email section when email is not available', () => {
      vi.mocked(useDynamicContext).mockReturnValue({
        ...mockUseDynamicContext,
        user: {
          ...mockUseDynamicContext.user,
          email: undefined,
        },
      });
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.queryByText('Email (Dynamic.xyz)')).not.toBeInTheDocument();
    });

    it('should handle missing wallet data gracefully', () => {
      vi.mocked(useDynamicContext).mockReturnValue({
        ...mockUseDynamicContext,
        primaryWallet: null,
      });
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // Should still render the sections but with fallback values
      expect(screen.getByText('Wallet Type')).toBeInTheDocument();
      expect(screen.getByText('Unknown')).toBeInTheDocument();
      expect(screen.getByText('Ethereum')).toBeInTheDocument(); // Default chain value
    });

    it('should handle missing wallet connector gracefully', () => {
      vi.mocked(useDynamicContext).mockReturnValue({
        ...mockUseDynamicContext,
        primaryWallet: {
          ...mockUseDynamicContext.primaryWallet,
          connector: null,
        },
      });
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
  });

  describe('Account Actions', () => {
    it('should render clear message history button', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
      expect(screen.getByText('Clear Message History')).toBeInTheDocument();
      expect(
        screen.getByText('Remove all signed messages from local storage')
      ).toBeInTheDocument();
    });

    it('should clear localStorage and show alert when clear button is clicked', async () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('signedMessages');
        expect(global.alert).toHaveBeenCalledWith(
          'Message history cleared successfully'
        );
      });
    });

    it('should have correct button styling and hover states', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      const clearButton = screen.getByRole('button');
      expect(clearButton.className).toContain('border');
      expect(clearButton.className).toContain('rounded-lg');
      expect(clearButton.className).toContain('hover:bg-gray-50');
      expect(clearButton.className).toContain('dark:hover:bg-gray-700');
    });
  });

  describe('Dark Mode Support', () => {
    it('should apply dark mode classes correctly', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // Check that dark mode classes are present in the DOM
      const container = screen.getByTestId('test-wrapper');
      expect(container).toBeInTheDocument();

      // Check for dark mode classes in the component structure
      const profileText = screen.getByText('Profile Settings');
      expect(profileText.className).toContain('dark:text-white');
    });
  });

  describe('Responsive Design', () => {
    it('should have responsive grid classes for account information', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // Look for the grid container that holds the account information
      const walletAddressLabel = screen.getByText('Wallet Address');
      const gridContainer = walletAddressLabel.closest('.grid');

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.className).toContain('grid-cols-1');
      expect(gridContainer?.className).toContain('md:grid-cols-2');
    });

    it('should have responsive classes for the main container', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // The main container should have responsive padding
      const mainContent = screen
        .getByText('Profile Settings')
        .closest('.max-w-4xl');
      expect(mainContent).toBeInTheDocument();
      expect(mainContent?.className).toContain('px-4');
      expect(mainContent?.className).toContain('sm:px-6');
      expect(mainContent?.className).toContain('lg:px-8');
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      render(<Profile />);

      // Check for h2 headings for main sections
      const headings = screen.getAllByRole('heading', { level: 2 });
      expect(headings.length).toBeGreaterThan(0);

      const sectionTitles = headings.map(h => h.textContent);
      expect(sectionTitles).toContain('Authentication Status');
      expect(sectionTitles).toContain('Account Information');
      expect(sectionTitles).toContain('Account Actions');
    });
  });

  describe('Error Handling', () => {
    it('should handle undefined user gracefully', () => {
      vi.mocked(useDynamicContext).mockReturnValue({
        ...mockUseDynamicContext,
        user: undefined,
      });
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      expect(() => render(<Profile />)).not.toThrow();
      expect(screen.queryByText('Email (Dynamic.xyz)')).not.toBeInTheDocument();
    });

    it('should handle empty wallet address', () => {
      vi.mocked(useDynamicContext).mockReturnValue({
        ...mockUseDynamicContext,
        primaryWallet: {
          ...mockUseDynamicContext.primaryWallet,
          address: '',
        },
      });
      vi.mocked(useAuth).mockReturnValue(mockUseAuth);

      expect(() => render(<Profile />)).not.toThrow();
    });
  });
});
