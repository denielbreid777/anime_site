'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAnime, useCurrentUser, usePostsList, useProducts } from '@/lib/hooks';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import PostCard from '@/components/PostCard';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';

interface AnimeDetailPageContentProps {
  id: number;
}

export function AnimeDetailPageContent({ id }: AnimeDetailPageContentProps) {
  const router = useRouter();
  const { data: anime, isLoading, error } = useAnime(id);
  const { data: user } = useCurrentUser() as any;
  const { data: posts } = usePostsList();
  const { data: products } = useProducts(undefined, id);
  const [activeTab, setActiveTab] = useState<'reviews' | 'fanart' | 'posts'>('reviews');

  const animePosts = posts?.filter((post: any) => post.anime_id === id) || [];
  const reviews = animePosts.filter((post: any) => post.type === 'review');
  const fanarts = animePosts.filter((post: any) => post.type === 'fanart');
  const regularPosts = animePosts.filter((post: any) => post.type === 'post');

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length
    : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0C10]">
        <Header user={user || null} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-96 w-full mb-8" />
          <Skeleton className="h-8 w-1/2 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen bg-[#0B0C10]">
        <Header user={user || null} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-400">Anime not found</p>
          <Link href="/anime" className="text-[#66FCF1] hover:text-[#45A29E]">
            ← Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    const currentPosts = activeTab === 'reviews' ? reviews : activeTab === 'fanart' ? fanarts : regularPosts;

    if (currentPosts.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-[#C5C6C7]">No {activeTab} yet</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPosts.map((post: any) => (
          <PostCard key={post.id} post={post} currentUserId={user?.id} />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/anime" className="text-[#C5C6C7] hover:text-[#66FCF1] mb-8 inline-block">
          ← Back to catalog
        </Link>

        {/* Anime Details */}
        <div className="bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl mb-8">
          <div className="relative h-96">
            {anime.poster_url ? (
              <>
                <img
                  src={anime.poster_url}
                  alt={anime.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <ImagePlaceholder text="Постер не завантажився" className="hidden absolute inset-0" />
              </>
            ) : (
              <ImagePlaceholder text="Немає постера" />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0C10] to-transparent p-6">
              <h1 className="text-4xl font-bold text-[#FFFFFF] mb-2">{anime.title}</h1>
              <div className="flex items-center space-x-4 text-[#C5C6C7]">
                <span>{anime.year}</span>
                <span>•</span>
                <span>{anime.episodes ? `${anime.episodes} episodes` : 'TBA'}</span>
                <span>•</span>
                <span className="capitalize">{anime.status}</span>
              </div>
            </div>
          </div>
          <div className="p-6">
            {reviews.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 text-2xl">★</span>
                  <span className="text-2xl font-bold text-[#FFFFFF]">{averageRating.toFixed(1)}/10</span>
                  <span className="text-[#C5C6C7]">({reviews.length} reviews)</span>
                </div>
              </div>
            )}
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-4">Description</h2>
            <p className="text-[#C5C6C7] leading-relaxed">{anime.description}</p>
            {user && (
              <div className="mt-6">
                <Link
                  href={`/posts/new?anime_id=${id}&type=review`}
                  className="px-6 py-3 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors inline-block"
                >
                  Написати рецензію
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
          <div className="flex space-x-4 mb-6 border-b border-[#45A29E] pb-4">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-[#66FCF1] border-b-2 border-[#66FCF1]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
            >
              Рецензії ({reviews.length})
            </button>
            <button
              onClick={() => setActiveTab('fanart')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'fanart'
                  ? 'text-[#66FCF1] border-b-2 border-[#66FCF1]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
            >
              Фан-арт ({fanarts.length})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-[#66FCF1] border-b-2 border-[#66FCF1]'
                  : 'text-[#C5C6C7] hover:text-[#66FCF1]'
              }`}
            >
              Пости ({regularPosts.length})
            </button>
          </div>

          {renderTabContent()}
        </div>

        {/* Merch Section */}
        {products && products.length > 0 && (
          <div className="mt-8 bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#FFFFFF] mb-6">Мерч цього аніме</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
