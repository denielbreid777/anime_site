'use client';

interface ImagePlaceholderProps {
  text?: string;
  className?: string;
}

export default function ImagePlaceholder({ text = 'No Image', className = '' }: ImagePlaceholderProps) {
  return (
    <div className={`bg-[#0B0C10] flex items-center justify-center ${className}`}>
      <div className="text-center p-4">
        <svg className="w-12 h-12 mx-auto text-[#45A29E] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-[#45A29E]">{text}</p>
      </div>
    </div>
  );
}
