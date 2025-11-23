'use client';

import Link from 'next/link';
import { Product } from '@/lib/api';
import { useCartStore } from '@/stores/cartStore';
import Button from './ui/Button';
import Card from './ui/Card';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    setIsAdding(true);
    addItem(product, 1);
    setTimeout(() => setIsAdding(false), 500);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-4xl">📦</span>
        )}
      </div>

      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
        {product.name}
      </h3>

      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-blue-600">
          ${product.price.toFixed(2)}
        </span>

        <Button
          variant="primary"
          size="sm"
          onClick={handleAddToCart}
          isLoading={isAdding}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {product.stock !== undefined && product.stock < 10 && (
        <p className="text-xs text-orange-500 mt-2">
          Only {product.stock} left in stock!
        </p>
      )}
    </Card>
  );
}
