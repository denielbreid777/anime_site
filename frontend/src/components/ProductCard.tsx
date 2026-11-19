'use client';

import Link from 'next/link';
import ImagePlaceholder from './ImagePlaceholder';
import SimpleBadge from './SimpleBadge';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const priceInDollars = (product.price / 100).toFixed(2);
  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock < 5;

  return (
    <Link
      href={`/shop/${product.id}`}
      className={`group relative bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-[#66FCF1]/20 hover:-translate-y-1 ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#0B0C10]">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <ImagePlaceholder />
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <SimpleBadge
            text={product.category === 'figure' ? 'Фігурка' : 'Мерч'}
            color={product.category === 'figure' ? '#66FCF1' : '#45A29E'}
          />
        </div>

        {/* Stock Badge */}
        {isOutOfStock && (
          <div className="absolute top-3 right-3">
            <SimpleBadge text="Немає в наявності" color="#ef4444" />
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-3 right-3">
            <SimpleBadge text={`Залишилось ${product.stock}`} color="#f59e0b" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-[#FFFFFF] mb-2 line-clamp-2 group-hover:text-[#66FCF1] transition-colors">
          {product.name}
        </h3>
        <p className="text-2xl font-bold text-[#66FCF1]">
          ${priceInDollars}
        </p>
      </div>
    </Link>
  );
}
