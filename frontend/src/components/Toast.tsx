'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function Toast({ message, type = 'success', onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-[#45A29E]' : 'bg-red-900';
  const textColor = type === 'success' ? 'text-[#0B0C10]' : 'text-red-400';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} ${textColor} px-6 py-3 rounded-lg shadow-lg animate-pulse`}>
      {message}
    </div>
  );
}
