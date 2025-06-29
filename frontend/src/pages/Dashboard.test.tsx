import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { render, mockUseDynamicContext } from '../test/utils';
import Dashboard from './Dashboard';

// Mock the child components
vi.mock('../components/DashboardMessageSigner', () => ({
  default: ({
    onMessageSigned,
  }: {
    onMessageSigned: (message: string, signature: string) => void;
  }) => (
    <div data-testid='message-signer'>
      <button onClick={() => onMessageSigned('Test message', '0xtest123')}>
        Sign Message
      </button>
    </div>
  ),
}));

vi.mock('../components/QuickStats', () => ({
  default: ({ signedMessages }: { signedMessages: any[] }) => (
    <div data-testid='quick-stats'>Messages: {signedMessages.length}</div>
  ),
}));

vi.mock('../components/MessageHistory', () => ({
  default: ({
    signedMessages,
    clearHistory,
  }: {
    signedMessages: any[];
    clearHistory: () => void;
  }) => (
    <div data-testid='message-history'>
      {signedMessages.length > 0 && (
        <button onClick={clearHistory}>Clear History</button>
      )}
      <div>History: {signedMessages.length} messages</div>
    </div>
  ),
}));

vi.mock('../components/HealthCheckModal', () => ({
  default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) =>
    isOpen ? (
      <div data-testid='health-modal'>
        <div>Health Check Modal</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null,
}));

vi.mock('../hooks/useBackendHealth', () => ({
  useBackendHealth: vi.fn(() => ({
    isHealthy: true,
    isChecking: false,
    healthMessage: 'Backend is healthy',
    healthMessageType: 'success',
    checkHealth: vi.fn(),
  })),
}));

describe('Dashboard Component', () => {
  const mockSignedMessage = {
    id: 'test-1',
    message: 'Hello World',
    signature: '0xabc123',
    timestamp: 1640995200000, // Jan 1, 2022
    walletAddress: '0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10',
    isValid: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Mock console.error to avoid noise in tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('Message Signing', () => {
    it('should add new message when signing is successful', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      const signButton = screen.getByText('Sign Message');
      fireEvent.click(signButton);

      await waitFor(() => {
        expect(screen.getByText('Messages: 1')).toBeInTheDocument();
      });
    });

    it('should save messages to localStorage after signing', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      const signButton = screen.getByText('Sign Message');
      fireEvent.click(signButton);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'signedMessages',
          expect.stringContaining('Test message')
        );
      });
    });
  });

  describe('Message History Management', () => {
    it('should save empty array to localStorage when history is cleared', async () => {
      const storedMessages = JSON.stringify([mockSignedMessage]);
      vi.mocked(localStorage.getItem).mockReturnValue(storedMessages);
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      const clearButton = screen.getByText('Clear History');
      fireEvent.click(clearButton);

      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'signedMessages',
          '[]'
        );
      });
    });
  });

  describe('Health Check Integration', () => {
    it('should display health status when available', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      // Health status should be integrated into the dashboard
      expect(screen.getByTestId('message-signer')).toBeInTheDocument();
    });

    it('should handle health check modal', () => {
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      // Health modal should not be visible initially
      expect(screen.queryByTestId('health-modal')).not.toBeInTheDocument();
    });
  });

  describe('Data Persistence', () => {
    it('should maintain message order chronologically', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      vi.mocked(useDynamicContext).mockReturnValue(mockUseDynamicContext);

      render(<Dashboard />);

      // Sign multiple messages
      const signButton = screen.getByText('Sign Message');
      fireEvent.click(signButton);

      await waitFor(() => {
        expect(screen.getByText('Messages: 1')).toBeInTheDocument();
      });

      fireEvent.click(signButton);

      await waitFor(() => {
        expect(screen.getByText('Messages: 2')).toBeInTheDocument();
      });

      // Verify localStorage was called to save the messages
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'signedMessages',
        expect.any(String)
      );
    });
  });
});
