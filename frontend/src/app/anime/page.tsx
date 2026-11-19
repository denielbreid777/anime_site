'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useAnimeList, useCurrentUser } from '@/lib/hooks';
import AnimeCard from '@/components/AnimeCard';
import Skeleton from '@/components/Skeleton';

export default function AnimeListPage() {
  const { data: user } = useCurrentUser();
  const { data: anime, isLoading, error } = useAnimeList();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'announced' | 'ongoing' | 'finished'>('all');

  const filteredAnime = anime?.filter((anime: any) => {
    const matchesSearch = anime.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || anime.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user || null} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-[#FFFFFF] mb-8">Anime Catalog</h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-[#1F2833] border-2 border-[#45A29E] text-[#FFFFFF] placeholder-[#45A29E] focus:outline-none focus:border-[#66FCF1]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | 'announced' | 'ongoing' | 'finished')}
            className="px-4 py-3 rounded-lg bg-[#1F2833] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
          >
            <option value="all">All Status</option>
            <option value="announced">Announced</option>
            <option value="ongoing">Ongoing</option>
            <option value="finished">Finished</option>
          </select>
        </div>

        {/* Anime Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[#1F2833] rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[2/3]" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400">Failed to load anime</p>
          </div>
        ) : filteredAnime.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#C5C6C7]">No anime found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAnime.map((anime: any) => (
              <AnimeCard key={anime.id} anime={anime} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
