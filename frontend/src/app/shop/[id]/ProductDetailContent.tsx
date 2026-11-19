'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import ImagePlaceholder from '@/components/ImagePlaceholder';
import AddToCartButton from '@/components/AddToCartButton';
import Skeleton from '@/components/Skeleton';
import SimpleBadge from '@/components/SimpleBadge';
import { useCurrentUser, useProduct } from '@/lib/hooks';

interface ProductDetailContentProps {
  productId: number;
}

export default function ProductDetailContent({ productId }: ProductDetailContentProps) {
  const { data: user } = useCurrentUser();
  const { data: product, isLoading, error } = useProduct(productId);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="aspect-[4/5] rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <p className="text-red-400 mb-4">Товар не знайдено</p>
          <Link
            href="/shop"
            className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors inline-block"
          >
            Повернутися в магазин
          </Link>
        </div>
      </div>
    );
  }

  const priceInDollars = (product.price / 100).toFixed(2);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#0B0C10]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImagePlaceholder />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <SimpleBadge
                text={product.category === 'figure' ? 'Фігурка' : 'Мерч'}
                color={product.category === 'figure' ? '#66FCF1' : '#45A29E'}
              />
              {isOutOfStock && (
                <SimpleBadge text="Немає в наявності" color="#ef4444" />
              )}
              {isLowStock && (
                <SimpleBadge text={`Залишилось ${product.stock}`} color="#f59e0b" />
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-[#FFFFFF] mb-4">
              {product.name}
            </h1>

            <p className="text-4xl font-bold text-[#66FCF1] mb-6">
              ${priceInDollars}
            </p>

            <p className="text-[#C5C6C7] mb-6 leading-relaxed">
              {product.description}
            </p>

            {product.anime_id && (
              <div className="mb-6">
                <p className="text-sm text-[#45A29E] mb-2">Аніме:</p>
                <Link
                  href={`/anime/${product.anime_id}`}
                  className="text-[#66FCF1] hover:text-[#45A29E] transition-colors"
                >
                  Переглянути аніме
                </Link>
              </div>
            )}

            <div className="mb-6">
              <p className="text-sm text-[#45A29E]">Наявність:</p>
              <p className="text-[#C5C6C7]">
                {isOutOfStock ? 'Немає в наявності' : `${product.stock} шт.`}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <AddToCartButton />
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-[#45A29E]">
        <div className="flex flex-wrap gap-4 justify-center text-[#C5C6C7]">
          <Link href="/" className="hover:text-[#66FCF1] transition-colors">
            → Home
          </Link>
          <Link href="/shop" className="hover:text-[#66FCF1] transition-colors">
            → Shop
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
