'use client';

import Link from 'next/link';
import { Post } from '@/types';
import Badge from './Badge';
import LikeButton from './LikeButton';
import RatingStars from './RatingStars';
import ImagePlaceholder from './ImagePlaceholder';

interface PostCardProps {
  post: Post;
  currentUserId?: number;
}

export default function PostCard({ post, currentUserId }: PostCardProps) {
  const getAuthorLabel = () => {
    if (currentUserId && post.author_id === currentUserId) {
      return 'Ви';
    }
    return `Користувач #${post.author_id}`;
  };

  return (
    <Link href={`/posts/${post.id}`} className="block">
      <div className="bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl hover:shadow-[#66FCF1]/20 transition-all duration-300 hover:scale-105">
        {post.type === 'fanart' && post.image_url ? (
          <div className="relative aspect-video">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <ImagePlaceholder text="Зображення не завантажилось" className="hidden absolute inset-0" />
          </div>
        ) : post.type === 'fanart' && !post.image_url ? (
          <div className="aspect-video">
            <ImagePlaceholder text="Немає зображення" />
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <Badge type={post.type} />
            {post.rating && <RatingStars rating={post.rating} />}
          </div>

          <h3 className="text-xl font-bold text-[#FFFFFF] mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-sm text-[#C5C6C7] mb-4 line-clamp-3">{post.content}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-[#45A29E]">{getAuthorLabel()}</span>
            <span className="text-xs text-[#45A29E]">
              {new Date(post.created_at).toLocaleDateString('uk-UA')}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <LikeButton />
          </div>
        </div>
      </div>
    </Link>
  );
}
