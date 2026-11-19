'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPost, updatePost, deletePost } from '@/lib/api';
import { useCurrentUser } from '@/lib/hooks';
import { Post } from '@/types';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import LikeButton from '@/components/LikeButton';
import CommentsSection from '@/components/CommentsSection';

interface PostDetailPageContentProps {
  id: number;
}

export function PostDetailPageContent({ id }: PostDetailPageContentProps) {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const loadPost = useCallback(async () => {
    try {
      const response = await getPost(id);
      if (response.ok) {
        const data: Post = await response.json();
        setPost(data);
        setFormData({
          title: data.title,
          content: data.content,
        });
      } else {
        router.push('/posts');
      }
    } catch (error) {
      console.error('Failed to load post:', error);
      router.push('/posts');
    } finally {
      setIsLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await updatePost(id, formData);
      if (response.ok) {
        setIsEditing(false);
        loadPost();
        setToastMessage('Post updated successfully');
        setToastType('success');
        setShowToast(true);
      } else {
        const error = await response.json();
        setToastMessage('Failed to update post');
        setToastType('error');
        setShowToast(true);
      }
    } catch {
      setToastMessage('Failed to update post');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleDeletePost = async () => {
    try {
      const response = await deletePost(id);
      if (response.ok) {
        setShowDeleteModal(false);
        setToastMessage('Post deleted successfully');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          router.push('/posts');
        }, 1500);
      } else {
        setToastMessage('Failed to delete post');
        setToastType('error');
        setShowToast(true);
      }
    } catch {
      setToastMessage('Failed to delete post');
      setToastType('error');
      setShowToast(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-[#C5C6C7]">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#0B0C10] flex items-center justify-center">
        <div className="text-[#C5C6C7]">Post not found</div>
      </div>
    );
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'review':
        return 'Рецензія';
      case 'fanart':
        return 'Фан-арт';
      default:
        return 'Пост';
    }
  };

  const canEdit = user && post.author_id === user.id;
  const canDelete = user && (post.author_id === user.id || user.is_admin);

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user || null} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isEditing ? (
          <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-[#FFFFFF] mb-4">Edit Post</h2>
            <form onSubmit={handleUpdatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Content</label>
                <textarea
                  required
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 py-3 px-4 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-3 px-4 rounded-lg border-2 border-[#45A29E] text-[#C5C6C7] font-semibold hover:border-[#66FCF1] hover:text-[#66FCF1] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-[#1F2833] rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#66FCF1]">
                {getTypeLabel(post.type)}
              </span>
              {post.rating && (
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-2xl font-bold text-[#FFFFFF]">{post.rating}/10</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-[#FFFFFF] mb-4">{post.title}</h1>
            <div className="flex items-center space-x-4 mb-6 text-sm text-[#45A29E]">
              <span>by {post.author_id === user?.id ? 'Ви' : `Користувач #${post.author_id}`}</span>
              <span>•</span>
              <span>{new Date(post.created_at).toLocaleDateString('uk-UA')}</span>
            </div>
            {post.image_url && (
              <div className="mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full rounded-lg"
                />
              </div>
            )}
            <div className="prose prose-invert max-w-none">
              <p className="text-[#C5C6C7] leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
            {post.anime_id && (
              <div className="mt-6 pt-6 border-t border-[#45A29E]">
                <p className="text-sm text-[#45A29E]">Anime ID: {post.anime_id}</p>
              </div>
            )}
            <div className="mt-6">
              <LikeButton />
            </div>
            <div className="mt-8 flex gap-4">
              {canEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-3 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-6 py-3 rounded-lg bg-red-900 text-red-400 font-semibold hover:bg-red-800 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="mt-8">
              <CommentsSection postId={id} />
            </div>
          </div>
        )}
      </main>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePost}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
