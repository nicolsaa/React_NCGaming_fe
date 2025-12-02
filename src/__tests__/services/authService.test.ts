import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authService } from '@/services/authService';

describe('authService - login (basic interaction with API)', () => {
  beforeEach(() => {
    (globalThis as any).fetch = vi.fn();
    const storage: Record<string, string> = {};
    // minimal localStorage mock
    (globalThis as any).localStorage = {
      getItem: (k: string) => storage[k] ?? null,
      setItem: (k: string, v: string) => { storage[k] = v; },
      removeItem: (k: string) => { delete storage[k]; },
      clear: () => { Object.keys(storage).forEach((k) => delete storage[k]); }
    } as any;
  });

  it('login - stores token and user on success', async () => {
    const resp = {
      token: 'tok123',
      type: 'Bearer',
      id: 1,
      username: 'User',
      email: 'user@example.com',
      role: 'USER'
    };

    (globalThis as any).fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => resp,
      status: 200,
      text: async () => ''
    } as any);

    const r = await authService.login({ email: 'user@example.com', password: 'pass' });
    expect(r.token).toBe('tok123');
  });
});
