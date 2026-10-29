import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getPostsList, getPost, createPost, createReview, createFanart, updatePost, deletePost } from './api';

describe('Posts API', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('getPostsList', () => {
    it('should fetch posts list without auth', async () => {
      const mockPosts = [
        { id: 1, type: 'post', title: 'My Post', content: 'Content', anime_id: null, rating: null, image_url: null, author: { id: 1, username: 'test' }, created_at: '2026-10-28' },
      ];
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPosts),
      } as Response));

      const response = await getPostsList();
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toEqual(mockPosts);
    });

    it('should include auth header when token exists', async () => {
      localStorage.setItem('access_token', 'test-token');
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      } as Response));

      await getPostsList();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });
  });

  describe('getPost', () => {
    it('should fetch single post by id', async () => {
      const mockPost = { id: 1, type: 'post', title: 'My Post', content: 'Content', anime_id: null, rating: null, image_url: null, author: { id: 1, username: 'test' }, created_at: '2026-10-28' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPost),
      } as Response));

      const response = await getPost(1);
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data).toEqual(mockPost);
    });
  });

  describe('createPost', () => {
    it('should create post with auth header', async () => {
      localStorage.setItem('access_token', 'test-token');
      const postData = { title: 'New Post', content: 'Content' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, type: 'post', ...postData, anime_id: null, rating: null, image_url: null, author: { id: 1, username: 'test' }, created_at: '2026-10-28' }),
      } as Response));

      const response = await createPost(postData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token',
          }),
          body: JSON.stringify(postData),
        })
      );
    });
  });

  describe('createReview', () => {
    it('should create review with anime_id and rating', async () => {
      localStorage.setItem('access_token', 'test-token');
      const reviewData = { title: 'Review', content: 'Content', anime_id: 1, rating: 9 };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, type: 'review', ...reviewData, image_url: null, author: { id: 1, username: 'test' }, created_at: '2026-10-28' }),
      } as Response));

      const response = await createReview(reviewData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/reviews'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(reviewData),
        })
      );
    });
  });

  describe('createFanart', () => {
    it('should create fanart with anime_id and image_url', async () => {
      localStorage.setItem('access_token', 'test-token');
      const fanartData = { title: 'Fanart', content: 'Content', anime_id: 1, image_url: 'https://...' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, type: 'fanart', ...fanartData, rating: null, author: { id: 1, username: 'test' }, created_at: '2026-10-28' }),
      } as Response));

      const response = await createFanart(fanartData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/fanart'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(fanartData),
        })
      );
    });
  });

  describe('updatePost', () => {
    it('should update post with PUT method', async () => {
      localStorage.setItem('access_token', 'test-token');
      const updateData = { title: 'Updated Title' };
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      } as Response));

      const response = await updatePost(1, updateData);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(updateData),
        })
      );
    });
  });

  describe('deletePost', () => {
    it('should delete post with DELETE method', async () => {
      localStorage.setItem('access_token', 'test-token');
      global.fetch = vi.fn(() => Promise.resolve({
        ok: true,
      } as Response));

      const response = await deletePost(1);
      expect(response.ok).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/posts/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});
