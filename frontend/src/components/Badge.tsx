'use client';

interface BadgeProps {
  type: 'post' | 'review' | 'fanart';
}

export default function Badge({ type }: BadgeProps) {
  const getColor = () => {
    switch (type) {
      case 'review':
        return 'bg-[#66FCF1] text-[#0B0C10]';
      case 'fanart':
        return 'bg-[#45A29E] text-[#0B0C10]';
      default:
        return 'bg-[#C5C6C7] text-[#0B0C10]';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'review':
        return 'Рецензія';
      case 'fanart':
        return 'Фан-арт';
      default:
        return 'Пост';
    }
  };

  return (
    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${getColor()}`}>
      {getLabel()}
    </span>
  );
}
