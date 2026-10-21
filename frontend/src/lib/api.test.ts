import { describe, it, expect, beforeEach, vi } from 'vitest';
import { loginUser, registerUser, getMe } from './api';

describe('API client', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('loginUser sends POST to /account/login with form-urlencoded body', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    } as Response);

    await loginUser('test@example.com', 'A1b2c3d4&+=');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/account/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'username=test%40example.com&password=A1b2c3d4%26%2B%3D',
      }
    );
  });

  it('loginUser correctly encodes special characters in password', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    } as Response);

    await loginUser('test@example.com', 'A1b2c3d4&+=');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/account/login',
      expect.objectContaining({
        body: expect.stringContaining('password=A1b2c3d4%26%2B%3D'),
      })
    );
  });

  it('registerUser sends POST JSON with username, email, password', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'test-token' }),
    } as Response);

    await registerUser({
      username: 'Test User',
      email: 'test@example.com',
      password: 'A1b2c3d4!',
    });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/account/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'Test User',
          email: 'test@example.com',
          password: 'A1b2c3d4!',
        }),
      }
    );
  });

  it('getMe sends GET with Authorization Bearer header', async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ username: 'Test', email: 'test@example.com' }),
    } as Response);

    await getMe('test-token');

    expect(mockFetch).toHaveBeenCalledWith(
      'http://127.0.0.1:8000/account/me',
      {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token',
        },
      }
    );
  });
});
