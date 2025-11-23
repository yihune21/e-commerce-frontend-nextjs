'use client';

import { useState, useEffect } from 'react';
import { productAPI, Product } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import Input from '@/components/ui/Input';
import { Search } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query?: string) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await productAPI.getProducts(query);
      setProducts(response.data);
    } catch (err: any) {
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(searchQuery);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Products
        </h1>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <Search className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-900 rounded-lg p-6 animate-pulse"
              >
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No products found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
