'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';
import { productAPI, categoryAPI, Product } from '@/lib/api';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { Trash2, Edit, Plus } from 'lucide-react';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock?: number;
}

interface CategoryForm {
  name: string;
}

export default function AdminPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const {
    register: registerProduct,
    handleSubmit: handleSubmitProduct,
    reset: resetProduct,
    formState: { errors: productErrors },
  } = useForm<ProductForm>();

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    formState: { errors: categoryErrors },
  } = useForm<CategoryForm>();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/');
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, router]);

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getProducts();
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const onSubmitProduct = async (data: ProductForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await productAPI.createProduct(data);
      setSuccess('Product created successfully!');
      resetProduct();
      setShowProductForm(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create product');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCategory = async (data: CategoryForm) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await categoryAPI.createCategory(data.name);
      setSuccess('Category created successfully!');
      resetCategory();
      setShowCategoryForm(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.deleteProduct(id);
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Admin Panel
        </h1>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900/30 border border-green-400 text-green-700 dark:text-green-400 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Products
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowProductForm(!showProductForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            {showProductForm && (
              <form onSubmit={handleSubmitProduct(onSubmitProduct)} className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <Input
                  label="Product Name"
                  placeholder="Enter product name"
                  error={productErrors.name?.message}
                  {...registerProduct('name', { required: 'Name is required' })}
                />
                <Input
                  label="Description"
                  placeholder="Enter description"
                  error={productErrors.description?.message}
                  {...registerProduct('description', { required: 'Description is required' })}
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  error={productErrors.price?.message}
                  {...registerProduct('price', {
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                  })}
                />
                <Input
                  label="Image URL"
                  placeholder="https://example.com/image.jpg"
                  error={productErrors.image?.message}
                  {...registerProduct('image')}
                />
                <Input
                  label="Category ID"
                  placeholder="Enter category ID"
                  error={productErrors.categoryId?.message}
                  {...registerProduct('categoryId', { required: 'Category ID is required' })}
                />
                <Input
                  label="Stock"
                  type="number"
                  placeholder="100"
                  error={productErrors.stock?.message}
                  {...registerProduct('stock')}
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    Create Product
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowProductForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Categories
              </h2>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowCategoryForm(!showCategoryForm)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </div>

            {showCategoryForm && (
              <form onSubmit={handleSubmitCategory(onSubmitCategory)} className="space-y-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded">
                <Input
                  label="Category Name"
                  placeholder="Enter category name"
                  error={categoryErrors.name?.message}
                  {...registerCategory('name', { required: 'Name is required' })}
                />
                <div className="flex gap-2">
                  <Button type="submit" variant="primary" isLoading={isLoading}>
                    Create Category
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCategoryForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
