'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCurrentUser, useAnimeList, useCreatePost, useCreateReview, useCreateFanart } from '@/lib/hooks';
import RatingStars from '@/components/RatingStars';
import TagList from '@/components/TagList';
import Skeleton from '@/components/Skeleton';

function CreatePostPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();
  const { data: animeList, isLoading: animeLoading } = useAnimeList();
  const createPost = useCreatePost();
  const createReview = useCreateReview();
  const createFanart = useCreateFanart();

  const [postType, setPostType] = useState<'post' | 'review' | 'fanart'>('post');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    anime_id: '',
    rating: 5,
    image_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get initial type and anime_id from URL params
  useEffect(() => {
    const typeParam = searchParams.get('type');
    const animeIdParam = searchParams.get('anime_id');
    
    if (typeParam === 'post' || typeParam === 'review' || typeParam === 'fanart') {
      setPostType(typeParam);
    }
    if (animeIdParam) {
      setFormData(prev => ({ ...prev, anime_id: animeIdParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (postType === 'post') {
        await createPost.mutateAsync({
          title: formData.title,
          content: formData.content,
        });
      } else if (postType === 'review') {
        await createReview.mutateAsync({
          title: formData.title,
          content: formData.content,
          anime_id: parseInt(formData.anime_id),
          rating: formData.rating,
        });
      } else if (postType === 'fanart') {
        await createFanart.mutateAsync({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
          anime_id: formData.anime_id ? parseInt(formData.anime_id) : undefined,
        });
      }
      router.push('/posts');
    } catch (err: any) {
      console.error('Error creating post:', err);
      setError('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-8">Create Post</h1>

        {/* Type Switcher */}
        <div className="flex gap-4 mb-8">
          <button
            type="button"
            onClick={() => setPostType('post')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              postType === 'post'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Пост
          </button>
          <button
            type="button"
            onClick={() => setPostType('review')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              postType === 'review'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Рецензія
          </button>
          <button
            type="button"
            onClick={() => setPostType('fanart')}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              postType === 'fanart'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Фан-арт
          </button>
        </div>

        {/* Form */}
        <div className="bg-[#1F2833] rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                placeholder="Enter title..."
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Content</label>
              <textarea
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                placeholder="Write your content..."
              />
            </div>

            {/* Anime Selector (for review and fanart) */}
            {(postType === 'review' || postType === 'fanart') && (
              <div>
                <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Anime</label>
                {animeLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <select
                    required={postType === 'review'}
                    value={formData.anime_id}
                    onChange={(e) => setFormData({ ...formData, anime_id: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                  >
                    <option value="">Select anime...</option>
                    {animeList?.map((anime: any) => (
                      <option key={anime.id} value={anime.id}>
                        {anime.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Rating (for review) */}
            {postType === 'review' && (
              <div>
                <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Rating</label>
                <RatingStars
                  rating={formData.rating}
                  readonly={false}
                  onRatingChange={(rating) => setFormData({ ...formData, rating })}
                />
              </div>
            )}

            {/* Image URL (for fanart) */}
            {postType === 'fanart' && (
              <div>
                <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Image URL</label>
                <input
                  type="url"
                  required
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
                  placeholder="https://..."
                />
              </div>
            )}

            {/* Tags (placeholder) */}
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Tags</label>
              <TagList />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>

        {/* Links to other pages */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Home
          </Link>
          <Link href="/anime" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Anime Catalog
          </Link>
          <Link href="/posts" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Posts
          </Link>
          <Link href="/profile" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Profile
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-[#C5C6C7]">Loading...</div>}>
      <CreatePostPageContent />
    </Suspense>
  );
}
