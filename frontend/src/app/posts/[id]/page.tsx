import { Suspense } from 'react';
import { PostDetailPageContent } from './PostDetailPageContent';

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0C10] flex items-center justify-center text-[#C5C6C7]">Loading...</div>}>
      <PostDetailPageContent id={parseInt(id)} />
    </Suspense>
  );
}
