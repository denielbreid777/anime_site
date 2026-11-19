'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getAnimeList, getAnime, createAnime, updateAnime, deleteAnime } from './api';
import { getPostsList, getPost, createPost, createReview, createFanart, updatePost, deletePost } from './api';
import { getComments, createComment, updateComment, deleteComment } from './api';
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from './api';
import { User } from '@/types';

export function useAnimeList() {
  return useQuery({
    queryKey: ['anime'],
    queryFn: async () => {
      const response = await getAnimeList();
      if (!response.ok) throw new Error('Failed to fetch anime list');
      return response.json();
    },
  });
}

export function useAnime(id: number) {
  return useQuery({
    queryKey: ['anime', id],
    queryFn: async () => {
      const response = await getAnime(id);
      if (!response.ok) throw new Error('Failed to fetch anime');
      return response.json();
    },
  });
}

export function useCreateAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createAnime(data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create anime' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
}

export function useUpdateAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await updateAnime(id, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to update anime' };
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
      queryClient.invalidateQueries({ queryKey: ['anime', variables.id] });
    },
  });
}

export function useDeleteAnime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteAnime(id);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to delete anime' };
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anime'] });
    },
  });
}

export function usePostsList() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await getPostsList();
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
  });
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const response = await getPost(id);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createPost(data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create post' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createReview(data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create review' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCreateFanart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createFanart(data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create fanart' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await updatePost(id, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to update post' };
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deletePost(id);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to delete post' };
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return null;
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000'}/account/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) return null;
      return response.json() as Promise<User>;
    },
    retry: false,
  });
}

// Comments hooks
export function useComments(postId: number) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await getComments(postId);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
  });
}

export function useCreateComment(postId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { content: string }) => {
      const response = await createComment(postId, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create comment' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ commentId, data }: { commentId: number; data: { content: string } }) => {
      const response = await updateComment(commentId, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to update comment' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (commentId: number) => {
      const response = await deleteComment(commentId);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to delete comment' };
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

// Products hooks
export function useProducts(category?: string, animeId?: number) {
  return useQuery({
    queryKey: ['products', category, animeId],
    queryFn: async () => {
      const response = await getProducts(category, animeId);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await getProduct(id);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const response = await createProduct(data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to create product' };
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await updateProduct(id, data);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to update product' };
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteProduct(id);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw { status: response.status, detail: errorData.detail || 'Failed to delete product' };
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
