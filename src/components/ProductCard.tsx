import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className="cursor-pointer border rounded-xl overflow-hidden shadow hover:shadow-md transition"
    >
      <img
        src={product.images?.[0] || 'https://via.placeholder.com/300'}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{product.title}</h3>
        <p className="text-blue-600 font-bold mt-1">${product.price}</p>
        <p className="text-gray-400 text-xs mt-1">{product.brand}</p>
      </div>
    </div>
  );
};

export default ProductCard;