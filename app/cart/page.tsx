'use client';

import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some products to get started!
          </p>
          <Link href="/products">
            <Button variant="primary">Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Shopping Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.productId}>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                    {item.product?.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl">📦</span>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                      {item.product?.description}
                    </p>
                    <p className="text-blue-600 font-bold mt-1">
                      ${item.product?.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(item.productId)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}

            <Button variant="danger" onClick={clearCart} className="w-full">
              Clear Cart
            </Button>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Order Summary
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Items ({totalItems})</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span>FREE</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <div className="flex justify-between text-xl font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span>${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {isAuthenticated ? (
                <Button variant="primary" className="w-full">
                  Proceed to Checkout
                </Button>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/login">
                    <Button variant="primary" className="w-full">
                      Login to Checkout
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    or{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:text-blue-700">
                      create an account
                    </Link>
                  </p>
                </div>
              )}

              <Link href="/products" className="block mt-4">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
