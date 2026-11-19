'use client';

import Header from '@/components/Header';
import { useCurrentUser, usePostsList, useAnimeList } from '@/lib/hooks';
import PostCard from '@/components/PostCard';
import AnimeCard from '@/components/AnimeCard';
import Skeleton from '@/components/Skeleton';
import Link from 'next/link';

export default function HomePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: posts, isLoading: postsLoading, error: postsError } = usePostsList();
  const { data: anime, isLoading: animeLoading, error: animeError } = useAnimeList();

  const recentPosts = posts?.slice(0, 6);
  const recentAnime = anime?.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user || null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4">
            Welcome to AnimeSocial
          </h1>
          <p className="text-xl text-[#C5C6C7]">
            Discover anime, share reviews, and connect with fellow fans
          </p>
        </div>

        {/* Recent Posts */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Recent Posts</h2>
            <Link href="/posts" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
              View all →
            </Link>
          </div>

          {postsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1F2833] rounded-2xl p-6">
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : postsError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load posts</p>
            </div>
          ) : recentPosts && recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPosts.map((post: any) => (
                <PostCard key={post.id} post={post} currentUserId={user?.id} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#C5C6C7]">No posts yet</p>
            </div>
          )}
        </section>

        {/* Popular Anime */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#FFFFFF]">Popular Anime</h2>
            <Link href="/anime" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
              View all →
            </Link>
          </div>

          {animeLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-[#1F2833] rounded-2xl overflow-hidden">
                  <Skeleton className="aspect-[2/3]" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : animeError ? (
            <div className="text-center py-12">
              <p className="text-red-400">Failed to load anime</p>
            </div>
          ) : recentAnime && recentAnime.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentAnime.map((anime: any) => (
                <AnimeCard key={anime.id} anime={anime} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#C5C6C7]">No anime yet</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
