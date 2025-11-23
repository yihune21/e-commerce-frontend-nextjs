'use client';

import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Button from './ui/Button';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const totalItems = getTotalItems();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            ShopHub
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-200 hover:text-blue-600" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user?.name}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link
              href="/products"
              className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            {isAuthenticated && user?.role === 'admin' && (
              <Link
                href="/admin"
                className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            <Link
              href="/cart"
              className="flex items-center text-gray-700 dark:text-gray-200 hover:text-blue-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Cart {totalItems > 0 && `(${totalItems})`}
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  className="block text-gray-700 dark:text-gray-200 hover:text-blue-600"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link href="/auth/login" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">Login</Button>
                </Link>
                <Link href="/auth/register" className="block" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" size="sm" className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
