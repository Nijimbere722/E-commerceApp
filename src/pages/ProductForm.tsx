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
  title: z
    .string()
    .min(1, 'Title is required')
    .refine((v) => v.trim() !== '', 'Cannot be empty spaces'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters'),
  brand: z
    .string()
    .min(1, 'Brand is required')
    .refine((v) => v.trim() !== '', 'Cannot be empty spaces'),
  price: z
    .preprocess(
      (val) => parseFloat(String(val)),
      z.number({ invalid_type_error: 'Price must be a number' }).positive('Price must be greater than 0')
    ),
  stock: z
    .preprocess(
      (val) => parseInt(String(val)),
      z.number({ invalid_type_error: 'Stock must be a number' }).int('Stock must be a whole number').nonnegative('Stock cannot be negative')
    ),
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
      const res = await api.get(`/public/products/${id}`);
      return res.data;
    },
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
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
      const payload = {
        title: data.title,
        description: data.description,
        brand: data.brand,
        price: data.price,
        stock: data.stock,
        images: [data.images],
        categoryId: data.categoryId,
      };
      if (isEdit) {
        await api.patch(`/