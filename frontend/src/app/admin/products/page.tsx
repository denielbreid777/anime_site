'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Modal from '@/components/Modal';
import Toast from '@/components/Toast';
import Skeleton from '@/components/Skeleton';
import { useCurrentUser, useProducts, useAnimeList, useCreateProduct, useUpdateProduct, useDeleteProduct } from '@/lib/hooks';
import { Product, ProductCategory } from '@/types';

export default function AdminProductsPage() {
  const router = useRouter();
  const { data: user } = useCurrentUser() as any;
  const { data: products, isLoading, error } = useProducts();
  const { data: animeList } = useAnimeList();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    category: 'merch' as ProductCategory,
    image_url: '',
    anime_id: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '0',
      category: 'merch',
      image_url: '',
      anime_id: '',
    });
  };

  const handleCreate = async () => {
    try {
      await createProduct.mutateAsync({
        name: formData.name,
        description: formData.description,
        price: Math.round(parseFloat(formData.price) * 100),
        stock: parseInt(formData.stock, 10),
        category: formData.category,
        image_url: formData.image_url || undefined,
        anime_id: formData.anime_id ? parseInt(formData.anime_id, 10) : undefined,
      });
      setShowCreateModal(false);
      resetForm();
      setToast({ message: 'Товар створено', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        router.push('/login');
      } else {
        setToast({ message: err?.detail || 'Не вдалося створити товар', type: 'error' });
      }
    }
  };

  const handleEdit = async () => {
    if (!editingProduct) return;
    try {
      await updateProduct.mutateAsync({
        id: editingProduct.id,
        data: {
          name: formData.name,
          description: formData.description,
          price: Math.round(parseFloat(formData.price) * 100),
          stock: parseInt(formData.stock, 10),
          category: formData.category,
          image_url: formData.image_url || undefined,
          anime_id: formData.anime_id ? parseInt(formData.anime_id, 10) : undefined,
        },
      });
      setShowEditModal(false);
      setEditingProduct(null);
      resetForm();
      setToast({ message: 'Товар оновлено', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        router.push('/login');
      } else {
        setToast({ message: err?.detail || 'Не вдалося оновити товар', type: 'error' });
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingProductId) return;
    try {
      await deleteProduct.mutateAsync(deletingProductId);
      setShowDeleteModal(false);
      setDeletingProductId(null);
      setToast({ message: 'Товар сховано', type: 'success' });
    } catch (err: any) {
      if (err?.status === 401) {
        router.push('/login');
      } else {
        setToast({ message: err?.detail || 'Не вдалося сховати товар', type: 'error' });
      }
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: (product.price / 100).toFixed(2),
      stock: product.stock.toString(),
      category: product.category,
      image_url: product.image_url || '',
      anime_id: product.anime_id?.toString() || '',
    });
    setShowEditModal(true);
  };

  // Redirect non-admin
  if (user && !user.is_admin) {
    router.push('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user || null} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF]">Товари</h1>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
          >
            Додати товар
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 mb-4">Не вдалося завантажити товари</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
            >
              Спробувати ще
            </button>
          </div>
        ) : (
          <div className="bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full">
              <thead className="bg-[#0B0C10]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Назва</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Категорія</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Ціна</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Наявність</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Активний</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Дії</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product: any) => (
                  <tr key={product.id} className="border-t border-[#45A29E]">
                    <td className="px-6 py-4 text-[#C5C6C7]">{product.id}</td>
                    <td className="px-6 py-4 text-[#C5C6C7]">{product.name}</td>
                    <td className="px-6 py-4 text-[#C5C6C7]">
                      {product.category === 'figure' ? 'Фігурка' : 'Мерч'}
                    </td>
                    <td className="px-6 py-4 text-[#C5C6C7]">
                      ${(product.price / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-[#C5C6C7]">{product.stock}</td>
                    <td className="px-6 py-4 text-[#C5C6C7]">
                      {product.is_active ? 'Так' : 'Ні'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1 rounded bg-[#66FCF1] text-[#0B0C10] text-sm font-semibold hover:bg-[#45A29E] transition-colors"
                        >
                          Редагувати
                        </button>
                        <button
                          onClick={() => {
                            setDeletingProductId(product.id);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-1 rounded bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                          Сховати
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onConfirm={handleCreate}
        title="Додати товар"
        confirmText="Створити"
        cancelText="Скасувати"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Назва</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Опис</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Ціна ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Наявність</label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Категорія</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#C5C6C7] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="merch">Мерч</option>
              <option value="figure">Фігурка</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">URL картинки</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Аніме</label>
            <select
              value={formData.anime_id}
              onChange={(e) => setFormData({ ...formData, anime_id: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#C5C6C7] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="">Без аніме</option>
              {animeList?.map((anime: any) => (
                <option key={anime.id} value={anime.id}>
                  {anime.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProduct(null);
          resetForm();
        }}
        onConfirm={handleEdit}
        title="Редагувати товар"
        confirmText="Зберегти"
        cancelText="Скасувати"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Назва</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Опис</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1] resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Ціна ($)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Наявність</label>
            <input
              type="number"
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Категорія</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ProductCategory })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#C5C6C7] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="merch">Мерч</option>
              <option value="figure">Фігурка</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">URL картинки</label>
            <input
              type="text"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Аніме</label>
            <select
              value={formData.anime_id}
              onChange={(e) => setFormData({ ...formData, anime_id: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#C5C6C7] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="">Без аніме</option>
              {animeList?.map((anime: any) => (
                <option key={anime.id} value={anime.id}>
                  {anime.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingProductId(null);
        }}
        onConfirm={handleDelete}
        title="Сховати товар"
        message="Ви впевнені, що хочете сховати цей товар? Цю дію не можна скасувати."
        confirmText="Сховати"
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
