import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import ProductDetailContent from './ProductDetailContent';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <ProductDetailContent productId={productId} />
    </div>
  );
}
