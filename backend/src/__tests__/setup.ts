import { vi, beforeEach } from 'vitest';

// Mock mongoose before any imports
vi.mock('mongoose', async () => {
  const actual = await vi.importActual('mongoose');
  return {
    ...actual,
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
});

// Setup global test utilities
beforeEach(() => {
  vi.clearAllMocks();
});

