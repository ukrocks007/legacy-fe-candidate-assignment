import type { ReactElement } from 'react';
import {
  render as rtlRender,
  type RenderOptions,
} from '@testing-library/react';

// Simple render function without complex provider wrapping
function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, {
    ...options,
  });
}

// Export everything from testing-library/react
export * from '@testing-library/react';

// Override render method
export { render };
