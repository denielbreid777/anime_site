import { Suspense } from 'react';
import { AnimeDetailPageContent } from './AnimeDetailPageContent';

export default async function AnimeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-[#C5C6C7]">Loading...</div>}>
      <AnimeDetailPageContent id={parseInt(id)} />
    </Suspense>
  );
}
