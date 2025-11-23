import axios from 'axios';
import { API_URL } from './config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/refreshToken`, {
          refreshToken,
        }, { withCredentials: true });

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// API Types
export interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  stock?: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
  product?: Product;
}

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post('/user', data),

  login: (email: string, password: string) =>
    api.get('/login', {
      headers: {
        Authorization: `Basic ${btoa(`${email}:${password}`)}`
      }
    }),

  logout: () => api.post('/logout'),

  getUser: () => api.get<User>('/user'),

  updatePassword: (oldPassword: string, newPassword: string) =>
    api.patch('/update-password', { oldPassword, newPassword }),

  sendOTP: (email: string) => api.post('/send-otp', { email }),

  verifyOTP: (email: string, otp: string, newPassword: string) =>
    api.post('/verify-otp', { email, otp, newPassword }),

  refreshToken: (refreshToken: string) =>
    api.post('/refreshToken', { refreshToken }),
};

// Product API
export const productAPI = {
  getProducts: (name?: string) =>
    api.get<Product[]>('/product', { params: name ? { name } : {} }),

  createProduct: (data: Partial<Product>) =>
    api.post('/product', data),

  updatePrice: (id: string, price: number) =>
    api.patch('/product-price', { id, price }),

  updateImage: (id: string, image: string) =>
    api.patch('/product-image', { id, image }),

  deleteProduct: (id: string) =>
    api.delete('/product', { data: { id } }),
};

// Category API
export const categoryAPI = {
  createCategory: (name: string) =>
    api.post('/category', { name }),

  updateCategory: (id: string, name: string) =>
    api.patch('/category', { id, name }),
};

// Cart API
export const cartAPI = {
  addToCart: (productId: string, quantity: number) =>
    api.post('/cart', { productId, quantity }),
};

// Admin API
export const adminAPI = {
  createAdmin: (data: { email: string; password: string; name: string }) =>
    api.post('/admin', data),

  deleteUser: (userId: string) =>
    api.post('/delete-user', { userId }),
};
