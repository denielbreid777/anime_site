'use client';

import { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Підтвердити',
  cancelText = 'Скасувати',
  children,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1F2833] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold text-[#FFFFFF] mb-4">{title}</h3>
        {message && <p className="text-[#C5C6C7] mb-6">{message}</p>}
        {children && <div className="mb-6">{children}</div>}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-lg border-2 border-[#45A29E] text-[#C5C6C7] font-semibold hover:border-[#66FCF1] hover:text-[#66FCF1] transition-colors"
          >
            {cancelText}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 py-3 px-6 rounded-lg bg-red-900 text-red-400 font-semibold hover:bg-red-800 transition-colors"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
