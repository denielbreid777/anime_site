import { vi } from 'vitest';

export const mockPush = vi.fn();

export const useRouter = () => ({
  push: mockPush,
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
});

export const usePathname = () => '/';

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({});
