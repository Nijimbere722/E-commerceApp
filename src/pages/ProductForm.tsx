import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import FormInput from '../components/FormInput';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, Product } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';

const schema = z.object({
  title: z.string().min(1, 'Title is required').refine(v => v.trim() !== '', 'Cannot be empty spaces'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  brand: z.string().min(1, 'Brand is required').refine(v => v.trim() !== '', 'Cannot be empty spaces'),
  price: z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be greater than 0'),
  stock: z.number({ invalid_type_error: 'Stock must be a number' }).int('Stock must be a whole number').nonnegative('Stock cannot be negative'),
  images: z.string().min(1, 'At least one image URL is required'),
  categoryId: z.string().min(1, 'Category is required'),
});

type ProductFormData = z.infer<typeof schema>;

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = id !== 'new';
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await api.get('/categories');
      return res.data;
    },
  });

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await api.get(`/products/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(schema),
    values: product
      ? {
          title: product.title,
          description: product.description,
          brand: product.brand,
          price: product.price,
          stock: product.stock,
          images: product.images?.[0] || '',
          categoryId: product.categoryId,
        }
      : undefined,
  });

  const mutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const payload = { ...data, images: [data.images] };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
      } else {
        await api.post('/products', payload);
      }
    },
    onSuccess: () => {
      toast.success(isEdit ? 'Product updated!' : 'Product created!');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      navigate('/admin');
    },
    onError: () => toast.error('Failed to save product'),
  });

  if (isEdit && isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h1>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}>
        <FormInput label="Title" name="title" register={register} error={errors.title?.message} />
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            {...register('description')}
            rows={4}
            className={`border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
        </div>
        <FormInput label="Brand" name="brand" register={register} error={errors.brand?.message} />
        <FormInput label="Price" name="price" type="number" register={register} error={errors.price?.message} />
        <FormInput label="Stock Quantity" name="stock" type="number" register={register} error={errors.stock?.message} />
        <FormInput label="Image URL" name="images" register={register} error={errors.images?.message} />
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <select
            {...register('categoryId')}
            className={`border rounded-lg px-3 py-2 text-sm ${errors.categoryId ? 'border-red-500' : 'border-gray-300'}`}
          >
            <option value="">Select a category</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && <p className="text-red-500 text-xs">{errors.categoryId.message}</p>}
        </div>
        <button
          type="submit"
          disabled={isSubmitting || mutation.isPending}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 mt-2"
        >
          {mutation.isPending ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductForm;