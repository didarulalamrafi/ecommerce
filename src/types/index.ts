export type Role = "user" | "admin";

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

export interface Product {
  _id: string;
  name: string;
  nameEn?: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
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