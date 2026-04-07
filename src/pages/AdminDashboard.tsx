import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmModal from '../components/ConfirmModal';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/public/products');
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/admin/products/${id}`);
    },
    onSuccess: () => {
      toast.success('Product deleted!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setDeleteId(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/admin/product/new')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Product
          </button>
          <button
            onClick={() => navigate('/admin/categories')}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Manage Categories
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            View Orders
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border rounded-xl overflow-hidden">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/50'}
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.title}
                </td>
                <td className="px-4 py-3 text-blue-600">${product.price}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/product/${product.id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <ConfirmModal
          message="Are you sure you want to delete this product?"
          onConfirm={() => deleteMutation.mutate(deleteId)}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;