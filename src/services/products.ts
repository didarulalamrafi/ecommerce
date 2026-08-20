// services/products.ts
import { api } from "@/lib/api";
import type { Product, ProductListResponse } from "@/types";

interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// backend pagination দিয়ে দেয়, তাই query string বানিয়ে পাঠানো হচ্ছে
export function getProducts(params: GetProductsParams = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return api.get<ProductListResponse>(`/api/products${qs ? `?${qs}` : ""}`);
}

export function getProduct(id: string) {
  return api.get<Product>(`/api/products/${id}`);
}

export function getCategories() {
  return api.get<string[]>("/api/categories");
}

// NEW: seller/admin dashboard এ নিজের বানানো প্রোডাক্ট লিস্ট
export function getMyProducts(page = 1, limit = 50) {
  return api.get<ProductListResponse>(`/api/products/mine?page=${page}&limit=${limit}`);
}

// admin/seller — verifyToken + role check backend এ হয়, এখানে শুধু কল
export function createProduct(product: Omit<Product, "_id">) {
  return api.post<Product>("/api/products", product);
}

export function updateProduct(id: string, product: Partial<Product>) {
  return api.put<{ message: string }>(`/api/products/${id}`, product);
}

export function deleteProduct(id: string) {
  return api.delete<{ message: string }>(`/api/products/${id}`);
}