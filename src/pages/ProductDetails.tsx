import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
  });

  const addToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { productId: id, quantity: 1 });
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!product) return <p className="text-center mt-10">Product not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <img
          src={product.images?.[0] || 'https://via.placeholder.com/400'}
          alt={product.title}
          className="w-full md:w-1/2 h-80 object-cover rounded-2xl"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{product.brand}</p>
          <p className="text-blue-600 text-2xl font-bold mt-3">${product.price}</p>
          <p className="text-gray-600 mt-4 text-sm leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-400 mt-2">In Stock: {product.stock}</p>
          <button
            onClick={addToCart}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;