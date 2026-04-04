import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import { Cart as CartType } from '../types';
import CartItem from '../components/CartItem';
import LoadingSpinner from '../components/LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Cart = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data: cart, isLoading } = useQuery<CartType>({
    queryKey: ['cart'],
    queryFn: async () => {
      const res = await api.get('/cart');
      return res.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (quantity <= 0) {
        await api.delete(`/cart/${productId}`);
      } else {
        await api.post('/cart', { productId, quantity });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
    onError: () => toast.error('Failed to update cart'),
  });

  const total = cart?.items?.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  ) ?? 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Cart</h1>
      {!cart?.items?.length ? (
        <p className="text-gray-500 text-center mt-10">Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onRemove={(productId) => updateMutation.mutate({ productId, quantity: 0 })}
              onQuantityChange={(productId, quantity) =>
                updateMutation.mutate({ productId, quantity })
              }
            />
          ))}
          <div className="flex justify-between items-center mt-6 border-t pt-4">
            <p className="text-lg font-bold text-gray-800">Total: ${total.toFixed(2)}</p>
            <button
              onClick={() => navigate('/checkout')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;