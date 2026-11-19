'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import { useCurrentUser, useAnimeList, useCreateAnime, useUpdateAnime, useDeleteAnime } from '@/lib/hooks';
import Modal from '@/components/Modal';
import Skeleton from '@/components/Skeleton';

export default function AdminAnimePage() {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { data: animeList, isLoading } = useAnimeList();
  const createAnime = useCreateAnime();
  const updateAnime = useUpdateAnime();
  const deleteAnime = useDeleteAnime();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    year: 2024,
    episodes: null as number | null,
    status: 'announced' as 'announced' | 'ongoing' | 'finished',
    poster_url: '',
  });

  useEffect(() => {
    if (user && !user.is_admin) {
      router.push('/');
    }
  }, [user, router]);

  const handleCreate = async () => {
    try {
      await createAnime.mutateAsync(formData);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating anime:', err);
    }
  };

  const handleEdit = async () => {
    if (!selectedAnime) return;
    try {
      await updateAnime.mutateAsync({ id: selectedAnime.id, data: formData });
      setShowEditModal(false);
      resetForm();
      setSelectedAnime(null);
    } catch (err) {
      console.error('Error updating anime:', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedAnime) return;
    try {
      await deleteAnime.mutateAsync(selectedAnime.id);
      setShowDeleteModal(false);
      setSelectedAnime(null);
    } catch (err) {
      console.error('Error deleting anime:', err);
    }
  };

  const openEditModal = (anime: any) => {
    setSelectedAnime(anime);
    setFormData({
      title: anime.title,
      description: anime.description,
      year: anime.year,
      episodes: anime.episodes,
      status: anime.status,
      poster_url: anime.poster_url || '',
    });
    setShowEditModal(true);
  };

  const openDeleteModal = (anime: any) => {
    setSelectedAnime(anime);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      year: 2024,
      episodes: null,
      status: 'announced',
      poster_url: '',
    });
  };

  if (!user) {
    return null;
  }

  if (!user.is_admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0B0C10]">
      <Header user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[#FFFFFF]">Admin - Anime Management</h1>
          <button
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
            className="px-6 py-3 rounded-lg bg-[#66FCF1] text-[#0B0C10] font-semibold hover:bg-[#45A29E] transition-colors"
          >
            Add Anime
          </button>
        </div>

        {/* Anime Table */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : (
          <div className="bg-[#1F2833] rounded-2xl overflow-hidden shadow-2xl">
            <table className="w-full">
              <thead className="bg-[#0B0C10]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Title</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Year</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Episodes</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#C5C6C7]">Status</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-[#C5C6C7]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {animeList?.map((anime: any) => (
                  <tr key={anime.id} className="border-t border-[#45A29E]">
                    <td className="px-6 py-4 text-[#FFFFFF]">{anime.title}</td>
                    <td className="px-6 py-4 text-[#C5C6C7]">{anime.year}</td>
                    <td className="px-6 py-4 text-[#C5C6C7]">{anime.episodes || 'TBA'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded text-xs font-semibold bg-[#45A29E] text-[#0B0C10] capitalize">
                        {anime.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openEditModal(anime)}
                        className="px-3 py-1 rounded bg-[#66FCF1] text-[#0B0C10] text-sm font-semibold hover:bg-[#45A29E] transition-colors mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteModal(anime)}
                        className="px-3 py-1 rounded bg-red-900 text-red-400 text-sm font-semibold hover:bg-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Links to other pages */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Home
          </Link>
          <Link href="/anime" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Anime Catalog
          </Link>
          <Link href="/posts" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Posts
          </Link>
          <Link href="/profile" className="text-[#66FCF1] hover:text-[#45A29E] transition-colors">
            → Profile
          </Link>
        </div>
      </main>

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onConfirm={handleCreate}
        title="Add Anime"
        confirmText="Create"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Year</label>
              <input
                type="number"
                required
                min={1900}
                max={2100}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Episodes</label>
              <input
                type="number"
                value={formData.episodes || ''}
                onChange={(e) => setFormData({ ...formData, episodes: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'announced' | 'ongoing' | 'finished' })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="announced">Announced</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Poster URL</label>
            <input
              type="url"
              value={formData.poster_url}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedAnime(null);
        }}
        onConfirm={handleEdit}
        title="Edit Anime"
        confirmText="Save"
        cancelText="Cancel"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Year</label>
              <input
                type="number"
                required
                min={1900}
                max={2100}
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Episodes</label>
              <input
                type="number"
                value={formData.episodes || ''}
                onChange={(e) => setFormData({ ...formData, episodes: e.target.value ? parseInt(e.target.value) : null })}
                className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'announced' | 'ongoing' | 'finished' })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            >
              <option value="announced">Announced</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#C5C6C7] mb-2">Poster URL</label>
            <input
              type="url"
              value={formData.poster_url}
              onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
              className="w-full px-4 py-3 rounded-lg bg-[#0B0C10] border-2 border-[#45A29E] text-[#FFFFFF] focus:outline-none focus:border-[#66FCF1]"
            />
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedAnime(null);
        }}
        onConfirm={handleDelete}
        title="Delete Anime"
        message={`Are you sure you want to delete "${selectedAnime?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
