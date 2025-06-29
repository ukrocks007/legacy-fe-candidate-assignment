import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from './utils.simple';

// Simple Modal Component for testing
const MockModal = ({
  isOpen,
  onClose,
  title = 'Test Modal',
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      {/* Backdrop */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50'
        onClick={onClose}
        data-testid='modal-backdrop'
      />

      {/* Modal */}
      <div className='relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700'>
          <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>
            {title}
          </h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            aria-label='Close modal'
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className='p-6'>
          {children || (
            <p className='text-gray-600 dark:text-gray-400'>
              Modal content goes here.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className='flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700'>
          <button
            onClick={onClose}
            className='px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md'
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md'
            onClick={() => {
              alert('Action confirmed');
              onClose();
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

describe('Modal Component UI Tests', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.alert = vi.fn();
  });

  describe('Modal Rendering Tests', () => {
    it('should not render when closed', () => {
      render(<MockModal isOpen={false} onClose={mockOnClose} />);

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(screen.queryByTestId('modal-backdrop')).not.toBeInTheDocument();
    });

    it('should render when open', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      expect(screen.getByTestId('modal-backdrop')).toBeInTheDocument();
      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content goes here.')).toBeInTheDocument();
    });

    it('should render custom title and content', () => {
      render(
        <MockModal isOpen={true} onClose={mockOnClose} title='Custom Title'>
          <p>Custom content</p>
        </MockModal>
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
      expect(screen.getByText('Custom content')).toBeInTheDocument();
    });
  });

  describe('Modal Interaction Tests', () => {
    it('should call onClose when close button is clicked', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close modal');
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when backdrop is clicked', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const backdrop = screen.getByTestId('modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when cancel button is clicked', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should show alert and close when confirm button is clicked', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const confirmButton = screen.getByText('Confirm');
      fireEvent.click(confirmButton);

      expect(global.alert).toHaveBeenCalledWith('Action confirmed');
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal Accessibility Tests', () => {
    it('should have proper ARIA labels', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const closeButton = screen.getByLabelText('Close modal');
      expect(closeButton).toBeInTheDocument();
    });

    it('should have proper button roles', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(3); // Close, Cancel, Confirm
    });

    it('should have proper heading structure', () => {
      render(
        <MockModal isOpen={true} onClose={mockOnClose} title='Test Title' />
      );

      const heading = screen.getByRole('heading', { level: 2 });
      expect(heading).toHaveTextContent('Test Title');
    });
  });

  describe('Modal Styling Tests', () => {
    it('should have correct z-index for layering', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const modalContainer = screen.getByTestId('modal-backdrop').parentElement;
      expect(modalContainer?.className).toContain('z-50');
    });

    it('should have dark mode support', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const modalContent = screen.getByText('Test Modal').closest('.bg-white');
      expect(modalContent?.className).toContain('dark:bg-gray-800');
    });

    it('should have responsive design classes', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const modalContent = screen.getByText('Test Modal').closest('.max-w-md');
      expect(modalContent?.className).toContain('w-full');
      expect(modalContent?.className).toContain('mx-4');
    });
  });

  describe('Modal Layout Tests', () => {
    it('should have proper structure with header, content, and footer', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      // Header
      expect(screen.getByText('Test Modal')).toBeInTheDocument();

      // Content
      expect(screen.getByText('Modal content goes here.')).toBeInTheDocument();

      // Footer buttons
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Confirm')).toBeInTheDocument();
    });

    it('should have proper borders between sections', () => {
      render(<MockModal isOpen={true} onClose={mockOnClose} />);

      const header = screen.getByText('Test Modal').closest('.border-b');
      expect(header).toBeInTheDocument();

      const footer = screen.getByText('Cancel').closest('.border-t');
      expect(footer).toBeInTheDocument();
    });
  });
});
