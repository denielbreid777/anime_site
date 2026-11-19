'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import Skeleton from '@/components/Skeleton';
import { useCurrentUser, useProducts, useAnimeList } from '@/lib/hooks';
import { ProductCategory } from '@/types';

export default function ShopPage() {
  const { data: user } = useCurrentUser() as any;
  const [category, setCategory] = useState<ProductCategory | 'all'>('all');
  const [animeFilter, setAnimeFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: products, isLoading, error } = useProducts(
    category === 'all' ? undefined : category,
    animeFilter || undefined
  );
  const { data: animeList } = useAnimeList();

  const filteredProducts = products?.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user} />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#1F2833] to-[#0B0C10] border-b border-[#45A29E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#FFFFFF] mb-4">
            Мерч і фігурки AniVerse
          </h1>
          <p className="text-lg text-[#C5C6C7]">
            Відкрийте для себе ексклюзивний мерч і фігурки улюблених аніме
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                category === 'all'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#45A29E] hover:text-[#0B0C10]'
              }`}
            >
              Усе
            </button>
            <button
              onClick={() => setCategory('figure')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                category === 'figure'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#45A29E] hover:text-[#0B0C10]'
              }`}
            >
              Фігурки
            </button>
            <button
              onClick={() => setCategory('merch')}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                category === 'merch'
                  ? 'bg-[#66FCF1] text-[#0B0C10]'
                  : 'bg-[#1F2833] text-[#C5C6C7] hover:bg-[#45A29E] hover:text-[#0B0C10]'
              }`}
            >
              Мерч
            </button>
          </div>

          {/* Anime Filter */}
          <select
            value={animeFilter || ''}
            onChange={(e) => setAnimeFilter(e.target.value ? Number(e.target.value) : null)}
            className="px-4 py-2 rounded-lg bg-[#1F2833] border-2 border-[#45A29E] text-[#C5C6C7] focus:outline-none focus:border-[#66FCF1]"
          >
            <option value="">Всі аніме</option>
            {animeList?.map((anime: any) => (
              <option key={anime.id} value={anime.id}>
                {anime.title}
              </option>
            ))}
          </select>

          {/* Search */}
          <input
            type="text"
            placeholder="Пошук за назвою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-[#1F2833] border-2 border-[#45A29E] text-[#C5C6C7] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1]"
          />
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Не вдалося завантажити товари</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
            >
              Спробувати ще
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#C5C6C7] text-lg">Товарів поки немає</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-[#45A29E] mt-12">
        <div className="flex flex-wrap gap-4 justify-center text-[#C5C6C7]">
          <Link href="/" className="hover:text-[#66FCF1] transition-colors">
            → Home
          </Link>
          <Link href="/anime" className="hover:text-[#66FCF1] transition-colors">
            → Anime Catalog
          </Link>
          <Link href="/posts" className="hover:text-[#66FCF1] transition-colors">
            → Posts
          </Link>
          {user && (
            <Link href="/profile" className="hover:text-[#66FCF1] transition-colors">
              → Profile
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
