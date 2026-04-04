import React from 'react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onRemove: (productId: string) => void;
  onQuantityChange: (productId: string, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove, onQuantityChange }) => {
  return (
    <div className="flex items-center gap-4 border-b py-4">
      <img
        src={item.product.images?.[0] || 'https://via.placeholder.com/80'}
        alt={item.product.title}
        className="w-20 h-20 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{item.product.title}</h4>
        <p className="text-blue-600 font-bold">${item.product.price}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity - 1)}
          className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
        >
          -
        </button>
        <span className="w-6 text-center">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.productId, item.quantity + 1)}
          className="w-8 h-8 bg-gray-200 rounded-full text-lg font-bold hover:bg-gray-300"
        >
          +
        </button>
      </div>
      <button
        onClick={() => onRemove(item.productId)}
        className="text-red-500 hover:text-red-700 text-sm"
      >
        Remove
      </button>
    </div>
  );
};

export default CartItem;