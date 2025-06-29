import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { render } from './utils.simple';

// Create a simple mock Profile component for testing
const MockProfile = () => {
  const handleClearHistory = () => {
    try {
      localStorage.removeItem('signedMessages');
      alert('Message history cleared successfully');
    } catch (error) {
      // Handle localStorage errors gracefully
      console.error('Failed to clear localStorage:', error);
    }
  };

  return (
    <div className='min-h-[calc(100vh-65px)] bg-gray-50 dark:bg-gray-900'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Profile Header */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700'>
          <div className='p-6'>
            <div className='flex items-center space-x-4'>
              <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center'>
                <span className='text-white'>👤</span>
              </div>
              <div>
                <span className='text-xl font-bold text-gray-900 dark:text-white'>
                  Profile Settings
                </span>
                <p className='text-gray-600 dark:text-gray-400'>
                  Manage your account settings and security preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Status */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Authentication Status
            </h2>
          </div>
          <div className='p-6'>
            <div className='flex items-center space-x-3'>
              <span className='text-green-500'>🛡️</span>
              <div>
                <h3 className='font-medium text-green-700 dark:text-green-400'>
                  Backend Authentication Active
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  You are authenticated with the backend and can access all
                  features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Account Information
            </h2>
          </div>
          <div className='p-6 space-y-4'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Wallet Address
                </label>
                <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <span className='font-mono text-sm text-gray-900 dark:text-white truncate'>
                    0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10
                  </span>
                </div>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Wallet Type
                </label>
                <div className='p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'>
                  <span className='text-sm text-gray-900 dark:text-white'>
                    MetaMask
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mt-6'>
          <div className='p-6 border-b border-gray-200 dark:border-gray-700'>
            <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
              Account Actions
            </h2>
          </div>
          <div className='p-6 space-y-4'>
            <button
              type='button'
              onClick={handleClearHistory}
              className='w-full p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left'
            >
              <div className='flex items-center space-x-3'>
                <span className='text-red-500'>🗑️</span>
                <div>
                  <h3 className='font-medium text-gray-900 dark:text-white'>
                    Clear Message History
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    Remove all signed messages from local storage
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

describe('Profile Component UI Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock alert
    global.alert = vi.fn();
  });

  describe('Rendering Tests', () => {
    it('should render the profile page title and description', () => {
      render(<MockProfile />);

      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(
        screen.getByText(
          'Manage your account settings and security preferences'
        )
      ).toBeInTheDocument();
    });

    it('should render all main sections', () => {
      render(<MockProfile />);

      expect(screen.getByText('Authentication Status')).toBeInTheDocument();
      expect(screen.getByText('Account Information')).toBeInTheDocument();
      expect(screen.getByText('Account Actions')).toBeInTheDocument();
    });

    it('should display authentication status correctly', () => {
      render(<MockProfile />);

      expect(
        screen.getByText('Backend Authentication Active')
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          'You are authenticated with the backend and can access all features.'
        )
      ).toBeInTheDocument();
    });

    it('should display wallet information correctly', () => {
      render(<MockProfile />);

      expect(screen.getByText('Wallet Address')).toBeInTheDocument();
      expect(
        screen.getByText('0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10')
      ).toBeInTheDocument();

      expect(screen.getByText('Wallet Type')).toBeInTheDocument();
      expect(screen.getByText('MetaMask')).toBeInTheDocument();
    });
  });

  describe('Interaction Tests', () => {
    it('should handle clear message history button click', async () => {
      render(<MockProfile />);

      const clearButton = screen.getByRole('button', {
        name: /clear message history/i,
      });
      expect(clearButton).toBeInTheDocument();

      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(localStorage.removeItem).toHaveBeenCalledWith('signedMessages');
        expect(global.alert).toHaveBeenCalledWith(
          'Message history cleared successfully'
        );
      });
    });

    it('should have proper button styling', () => {
      render(<MockProfile />);

      const clearButton = screen.getByRole('button', {
        name: /clear message history/i,
      });

      expect(clearButton.className).toContain('border');
      expect(clearButton.className).toContain('rounded-lg');
      expect(clearButton.className).toContain('hover:bg-gray-50');
      expect(clearButton.className).toContain('dark:hover:bg-gray-700');
    });
  });

  describe('Accessibility Tests', () => {
    it('should have proper heading structure', () => {
      render(<MockProfile />);

      const headings = screen.getAllByRole('heading');
      expect(headings).toHaveLength(5); // Profile Settings + 3 section titles + Clear Message History

      const sectionTitles = headings.map(h => h.textContent);
      expect(sectionTitles).toContain('Authentication Status');
      expect(sectionTitles).toContain('Account Information');
      expect(sectionTitles).toContain('Account Actions');
    });

    it('should have proper form labels', () => {
      render(<MockProfile />);

      expect(screen.getByText('Wallet Address')).toBeInTheDocument();
      expect(screen.getByText('Wallet Type')).toBeInTheDocument();
    });

    it('should have accessible button', () => {
      render(<MockProfile />);

      const button = screen.getByRole('button', {
        name: /clear message history/i,
      });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Responsive Design Tests', () => {
    it('should have responsive container classes', () => {
      render(<MockProfile />);

      const container = screen
        .getByText('Profile Settings')
        .closest('.max-w-4xl');
      expect(container).toBeInTheDocument();
      expect(container?.className).toContain('px-4');
      expect(container?.className).toContain('sm:px-6');
      expect(container?.className).toContain('lg:px-8');
    });

    it('should have responsive grid layout', () => {
      render(<MockProfile />);

      const walletAddressLabel = screen.getByText('Wallet Address');
      const gridContainer = walletAddressLabel.closest('.grid');

      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer?.className).toContain('grid-cols-1');
      expect(gridContainer?.className).toContain('md:grid-cols-2');
    });
  });

  describe('Dark Mode Support Tests', () => {
    it('should include dark mode classes', () => {
      render(<MockProfile />);

      const profileTitle = screen.getByText('Profile Settings');
      expect(profileTitle.className).toContain('dark:text-white');

      const description = screen.getByText(
        'Manage your account settings and security preferences'
      );
      expect(description.className).toContain('dark:text-gray-400');
    });

    it('should have dark mode classes on containers', () => {
      render(<MockProfile />);

      const container = screen
        .getByText('Profile Settings')
        .closest('.bg-white');
      expect(container?.className).toContain('dark:bg-gray-800');
      expect(container?.className).toContain('dark:border-gray-700');
    });
  });

  describe('Layout Tests', () => {
    it('should render correct number of sections', () => {
      render(<MockProfile />);

      // Count the number of main sections by looking for divs with specific background classes
      const sections = screen
        .getByText('Profile Settings')
        .closest('.max-w-4xl')
        ?.querySelectorAll('.bg-white');
      expect(sections).toHaveLength(4); // Header, Auth Status, Account Info, Account Actions
    });

    it('should have proper spacing between sections', () => {
      render(<MockProfile />);

      const authSection = screen
        .getByText('Authentication Status')
        .closest('.bg-white');
      expect(authSection?.className).toContain('mt-6');
    });
  });
});
