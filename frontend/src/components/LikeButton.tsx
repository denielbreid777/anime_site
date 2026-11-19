'use client';

interface LikeButtonProps {
  count?: number;
}

export default function LikeButton({ count = 0 }: LikeButtonProps) {
  return (
    <button
      disabled
      className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0B0C10] text-[#45A29E] cursor-not-allowed opacity-60 hover:opacity-60 transition-opacity"
      title="Скоро"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
      <span className="text-sm font-semibold">{count}</span>
    </button>
  );
}
