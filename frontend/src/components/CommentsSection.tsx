'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import Skeleton from '@/components/Skeleton';
import { useCurrentUser, useComments, useCreateComment, useUpdateComment, useDeleteComment } from '@/lib/hooks';
import { Comment } from '@/types';
import { clearToken } from '@/lib/auth';

interface CommentsSectionProps {
  postId: number;
}

export default function CommentsSection({ postId }: CommentsSectionProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useCurrentUser();
  const { data: comments, isLoading, error } = useComments(postId);
  const createComment = useCreateComment(postId);
  const updateComment = useUpdateComment();
  const deleteComment = useDeleteComment();

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [validationError, setValidationError] = useState('');

  const handleCreateComment = async () => {
    if (!newComment.trim()) {
      setValidationError('Коментар не може бути порожнім');
      return;
    }
    if (newComment.length > 2000) {
      setValidationError('Коментар занадто довгий (максимум 2000 символів)');
      return;
    }

    try {
      await createComment.mutateAsync({ content: newComment });
      setNewComment('');
      setValidationError('');
      setToast({ message: 'Коментар додано', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        clearToken();
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      } else if (err?.status === 422) {
        setValidationError(err?.detail || 'Помилка валідації');
      } else {
        setToast({ message: 'Не вдалося додати коментар', type: 'error' });
      }
    }
  };

  const handleEditComment = async () => {
    if (!editContent.trim()) {
      setValidationError('Коментар не може бути порожнім');
      return;
    }
    if (editContent.length > 2000) {
      setValidationError('Коментар занадто довгий (максимум 2000 символів)');
      return;
    }

    try {
      await updateComment.mutateAsync({ commentId: editingCommentId!, data: { content: editContent } });
      setEditingCommentId(null);
      setEditContent('');
      setValidationError('');
      setToast({ message: 'Коментар оновлено', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        clearToken();
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      } else if (err?.status === 422) {
        setValidationError(err?.detail || 'Помилка валідації');
      } else {
        setToast({ message: 'Не вдалося оновити коментар', type: 'error' });
      }
    }
  };

  const handleDeleteComment = async () => {
    if (!deletingCommentId) return;

    try {
      await deleteComment.mutateAsync(deletingCommentId);
      setShowDeleteModal(false);
      setDeletingCommentId(null);
      setToast({ message: 'Коментар видалено', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        clearToken();
        queryClient.invalidateQueries({ queryKey: ['currentUser'] });
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      } else {
        setToast({ message: 'Не вдалося видалити коментар', type: 'error' });
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="mt-8 pt-6 border-t border-[#45A29E]">
        <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Коментарі</h3>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 pt-6 border-t border-[#45A29E]">
        <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">Коментарі</h3>
        <p className="text-red-400">Не вдалося завантажити коментарі</p>
      </div>
    );
  }

  const sortedComments = [...(comments || [])].sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <div className="mt-8 pt-6 border-t border-[#45A29E]">
      <h3 className="text-lg font-bold text-[#FFFFFF] mb-4">
        Коментарі ({sortedComments.length})
      </h3>

      {/* Comments List */}
      {sortedComments.length === 0 ? (
        <div className="bg-[#1F2833] rounded-2xl p-6 text-center shadow-2xl">
          <p className="text-[#C5C6C7]">Коментарів поки немає — будьте першим!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedComments.map((comment: Comment) => {
            const isOwn = comment.author_id === user?.id;
            const isEditing = editingCommentId === comment.id;

            return (
              <div
                key={comment.id}
                className={`bg-[#1F2833] rounded-xl p-4 shadow-lg ${
                  isOwn ? 'border-2 border-[#66FCF1]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-[#FFFFFF]">
                        {isOwn ? 'Ви' : `Користувач #${comment.author_id}`}
                      </span>
                      <span className="text-sm text-[#45A29E]">
                        • {formatDate(comment.created_at)}
                      </span>
                    </div>
                  </div>
                  {(isOwn || user?.is_admin) && !isEditing && (
                    <div className="flex gap-2">
                      {isOwn && (
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditContent(comment.content);
                          }}
                          className="text-sm text-[#66FCF1] hover:text-[#45A29E] transition-colors"
                        >
                          Редагувати
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setDeletingCommentId(comment.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-sm text-red-400 hover:text-red-300 transition-colors"
                      >
                        Видалити
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1] resize-none"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingCommentId(null);
                          setEditContent('');
                          setValidationError('');
                        }}
                        className="px-4 py-2 rounded-lg border-2 border-[#45A29E] text-[#C5C6C7] hover:border-[#66FCF1] hover:text-[#66FCF1] transition-colors"
                      >
                        Скасувати
                      </button>
                      <button
                        onClick={handleEditComment}
                        className="px-4 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
                      >
                        Зберегти
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#C5C6C7] whitespace-pre-wrap">{comment.content}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Comment Form */}
      {user ? (
        <div className="mt-6 bg-[#1F2833] rounded-2xl p-6 shadow-2xl">
          <textarea
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              setValidationError('');
            }}
            placeholder="Напишіть коментар..."
            rows={3}
            className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1] resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-[#45A29E]">
              {newComment.length}/2000
            </span>
            <button
              onClick={handleCreateComment}
              disabled={!newComment.trim() || createComment.isPending}
              className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createComment.isPending ? 'Надсилання...' : 'Надіслати'}
            </button>
          </div>
          {validationError && (
            <p className="mt-2 text-sm text-red-400">{validationError}</p>
          )}
        </div>
      ) : (
        <div className="mt-6 bg-[#1F2833] rounded-2xl p-6 text-center shadow-2xl">
          <p className="text-[#C5C6C7] mb-2">Увійдіть, щоб коментувати</p>
          <Link
            href={`/login?next=${encodeURIComponent(window.location.pathname)}`}
            className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors inline-block"
          >
            Увійти
          </Link>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCommentId(null);
        }}
        onConfirm={handleDeleteComment}
        title="Видалити коментар"
        message="Ви впевнені, що хочете видалити цей коментар? Цю дію не можна скасувати."
        confirmText="Видалити"
        cancelText="Скасувати"
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
