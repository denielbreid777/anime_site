import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getAnimeList, getAnime, createAnime, updateAnime, deleteAnime } from './api';

describe('Anime API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('getAnimeList', () => {
    it('should fetch anime list without auth', async () => {
      const mockAnime = [
        { id: 1, title: 'Attack on Titan', description: '...', year: 2013, episodes: 87, status: 'ongoing', poster_url: '...', created_at: '2026-10-28' },
      ];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnime),
      } as Response));

      const response = await getAnimeList();
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toEqual(mockAnime);
    });

    it('should include auth header when token exists', async () => {
      localStorage.setItem('access_token', 'test-token');
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response));

      await getAnimeList();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/anime'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('getAnime', () => {
    it('should fetch single anime by id', async () => {
      const mockAnime = { id: 1, title: 'Attack on Titan', description: '...', year: 2013, episodes: 87, status: 'ongoing', poster_url: '...', created_at: '2026-10-28' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAnime),
      } as Response));

      const response = await getAnime(1);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toEqual(mockAnime);
    });
  });

  describe('createAnime', () => {
    it('should create anime with auth header', async () => {
      localStorage.setItem('access_token', 'test-token');
      const animeData = {
        title: 'New Anime',
        description: 'Description',
        year: 2024,
        episodes: 12,
        status: 'announced' as const,
        poster_url: 'https://...',
      };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, ...animeData, created_at: '2026-10-28' }),
      } as Response));

      const response = await createAnime(animeData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/anime'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
          body: JSON.stringify(animeData),
        })
      );
    });
  });

  describe('updateAnime', () => {
    it('should update anime with PATCH method', async () => {
      localStorage.setItem('access_token', 'test-token');
      const updateData = { title: 'Updated Title' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response));

      const response = await updateAnime(1, updateData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/anime/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('deleteAnime', () => {
    it('should delete anime with DELETE method', async () => {
      localStorage.setItem('access_token', 'test-token');
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
      } as Response));

      const response = await deleteAnime(1);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/anime/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
