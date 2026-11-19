'use client';

interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[#45A29E]/20 rounded ${className}`} />
  );
}
