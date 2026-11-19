'use client';

interface SimpleBadgeProps {
  text: string;
  color: string;
}

export default function SimpleBadge({ text, color }: SimpleBadgeProps) {
  return (
    <span
      className="text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded"
      style={{ backgroundColor: color, color: '#0B0C10' }}
    >
      {text}
    </span>
  );
}
