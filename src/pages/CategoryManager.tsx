import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Category } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import toast from 'react-hot-toast';

const CategoryManager = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      await api.post('/categories', { name: newCategory });
    },
    onSuccess: () => {
      toast.success('Category created!');
      setNewCategory('');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Failed to create category'),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      await api.patch(`/categories/${editId}`, { name: editName });
    },
    onSuccess: () => {
      toast.success('Category updated!');
      setEditId(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Failed to update category'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/categories/${id}`);
    },
    onSuccess: () => {
      toast.success('Category deleted!');
      setDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast.error('Failed to delete category'),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Categories</h1>

      <div className="flex gap-3 mb-6">
        <input
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={() => createMutation.mutate()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center gap-3 border rounded-lg px-4 py-3">
            {editId === cat.id ? (
              <>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 border rounded px-2 py-1 text-sm"
                />
                <button onClick={() => updateMutation.mutate()} className="text-green-600 text-sm">Save</button>
                <button onClick={() => setEditId(null)} className="text-gray-500 text-sm">Cancel</button>
              </>
            ) : (
              <>
                <span className="flex-1 text-gray-700">{cat.name}</span>
                <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="text-blue-600 text-sm">Edit</button>
                <button onClick={() => setDeleteId(cat.id)} className="text-red-500 text-sm">Delete</button>
              </>
            )}
          </div>
        ))}
      </div>

      {deleteId && (
        <ConfirmModal
          message="Delete this category?"
          onConfirm={() => deleteMutation.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default CategoryManager;