'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { usePostsList, useCurrentUser } from '@/lib/hooks';
import PostCard from '@/components/PostCard';
import TagList from '@/components/TagList';
import Skeleton from '@/components/Skeleton';

export default function PostsListPage() {
  const { data: user } = useCurrentUser();
  const { data: posts, isLoading, error } = usePostsList();
  const [typeFilter, setTypeFilter] = useState<'all' | 'post' | 'review' | 'fanart'>('all');

  const filteredPosts = posts?.filter((post: any) => {
    if (typeFilter === 'all') return true;
    return post.type === typeFilter;
  }) || [];

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user || null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF]">Posts</h1>
          {user && (
            <Link
              href="/posts/new"
              className="px-6 py-3 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
            >
              Create Post
            </Link>
          )}
        </div>

        {/* Filter */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              typeFilter === 'all'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Усі
          </button>
          <button
            onClick={() => setTypeFilter('post')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              typeFilter === 'post'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Пости
          </button>
          <button
            onClick={() => setTypeFilter('review')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              typeFilter === 'review'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Рецензії
          </button>
          <button
            onClick={() => setTypeFilter('fanart')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              typeFilter === 'fanart'
                ? 'bg-[#66FCF1] text-[#0B0C10]'
                : 'bg-[#0B0C10] text-[#C5C6C7] border-2 border-[#45A29E] hover:border-[#66FCF1]'
            }`}
          >
            Фан-арт
          </button>
        </div>

        {/* Posts Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-[#1F2833] rounded-2xl p-6">
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load posts</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#C5C6C7]">No posts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post: any) => (
              <div key={post.id} className="relative">
                <PostCard post={post} currentUserId={user?.id} />
                <div className="mt-2">
                  <TagList />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
