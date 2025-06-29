import React from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';

// Create a custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return <div data-testid='test-wrapper'>{children}</div>;
  };

  return render(ui, { wrapper: AllTheProviders, ...options });
};

// Mock functions for Dynamic.xyz and contexts
export const mockUseDynamicContext = {
  user: {
    email: 'test@example.com',
    id: 'test-user-id',
  },
  primaryWallet: {
    address: '0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10',
    connector: {
      name: 'MetaMask',
    },
    chain: 'Ethereum',
  },
  isAuthenticated: true,
  setShowAuthFlow: vi.fn(),
} as any; // Use 'as any' to bypass strict typing for testing

export const mockUseAuth = {
  isAuthenticated: true,
  user: {
    id: 'backend-user-id',
    walletAddress: '0x742d35Cc6bC40532c31C52Eb345b27C2b37A7c10',
  },
  token: 'mock-jwt-token',
  isLoading: false,
  error: null,
  authenticateWithWallet: vi.fn(),
  logout: vi.fn(),
  clearError: vi.fn(),
};

export const mockUseTheme = {
  theme: 'light' as const,
  toggleTheme: vi.fn(),
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
