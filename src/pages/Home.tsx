import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Product, Category } from '../types';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('');

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await api.get('/products');
      return res.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const filtered = selectedCategory
    ? products?.filter((p) => p.category?.id === selectedCategory)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Our Products</h1>

      {/* Category Filter */}
      <div className="flex gap-3 flex-wrap mb-6">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-4 py-1 rounded-full text-sm border ${
            selectedCategory === '' ? 'bg-blue-600 text-white' : 'text-gray-600'
          }`}
        >
          All
        </button>
        {categories?.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-1 rounded-full text-sm border ${
              selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {productsLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;