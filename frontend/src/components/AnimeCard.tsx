'use client';

import Link from 'next/link';
import { Anime } from '@/types';
import ImagePlaceholder from './ImagePlaceholder';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  return (
    <Link href={`/anime/${anime.id}`} className="block">
      <div className="bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#66FCF1]/20 transition-all duration-300 hover:scale-105">
        <div className="relative aspect-[2/3] overflow-hidden">
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
          <div className="absolute top-2 right-2 bg-[#0B0C10]/80 backdrop-blur-sm px-3 py-1 rounded-full">
            <span className="text-xs font-semibold text-[#66FCF1]">
              {anime.status}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-[#FFFFFF] mb-2 line-clamp-2">{anime.title}</h3>
          <p className="text-sm text-[#C5C6C7] mb-2 line-clamp-2">{anime.description}</p>
          <div className="flex items-center justify-between text-xs text-[#45A29E]">
            <span>{anime.year}</span>
            <span>{anime.episodes ? `${anime.episodes} episodes` : 'TBA'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
