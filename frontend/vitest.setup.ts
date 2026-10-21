import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import '@/test/mocks/next-navigation';

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.restoreAllMocks();
});
