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

// seller dashboard এ নিজের বানানো প্রোডাক্ট লিস্ট (pending/approved/rejected সব স্ট্যাটাস সহ)
export function getMyProducts(page = 1, limit = 50) {
  return api.get<ProductListResponse>(
    `/api/products/mine?page=${page}&limit=${limit}`,
  );
}

// seller/admin — verifyToken + role check backend এ হয়, এখানে শুধু কল
// seller ক্রিয়েট করলে ব্যাকএন্ডে status ডিফল্ট "pending" সেট হবে
export function createProduct(product: Omit<Product, "_id">) {
  return api.post<Product>("/api/products", product);
}

export function updateProduct(id: string, product: Partial<Product>) {
  return api.put<{ message: string }>(`/api/products/${id}`, product);
}

export function deleteProduct(id: string) {
  return api.delete<{ message: string }>(`/api/products/${id}`);
}

// ---- Admin review (seller-submitted প্রোডাক্ট) ----
interface GetPendingParams {
  page?: number;
  limit?: number;
}
export function getPendingProducts(params: GetPendingParams = {}) {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  return api.get<ProductListResponse>(`/api/products/pending${qs ? `?${qs}` : ""}`);
}

export function approveProduct(id: string, note?: string) {
  return api.patch<{ message: string }>(`/api/products/${id}/approve`, { note });
}

export function rejectProduct(id: string, note?: string) {
  return api.patch<{ message: string }>(`/api/products/${id}/reject`, { note });
}