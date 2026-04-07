import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import { Order } from '../types';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderHistory = () => {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['myOrders'],
    queryFn: async () => {
      const res = await api.get('/auth/orders');
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h1>
      {!orders?.length ? (
        <p className="text-gray-500 text-center">No orders yet.</p>
      ) : (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      )}
    </div>
  );
};

export default OrderHistory;