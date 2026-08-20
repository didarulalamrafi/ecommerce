// types/index.ts

export type Role = "user" | "seller" | "admin";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: Role;
  number?: string;
  address?: string;
  bio?: string;
  createdAt?: string;
}

export type ProductStatus = "pending" | "approved" | "rejected";

export interface ProductSeller {
  _id: string;
  name: string;
  email?: string;
}

export interface Product {
  _id: string;
  name: string;
  nameEn?: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  artisan?: string;
  tag?: string;
  stock?: number;
  status?: ProductStatus;
  adminNote?: string;
  seller?: ProductSeller | string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}

export interface ApiErrorBody {
  error: string;
  details?: string;
}