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

// ---- চেকআউট/কার্টের আইটেম — এখনো অর্ডার হয়নি ----
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

// ---- অর্ডারের আইটেম — CartItem থেকে আলাদা কারণ প্রতিটা আইটেম
// আলাদা সেলারের হতে পারে এবং প্রতিটার নিজস্ব স্ট্যাটাস/নোট থাকে ----
export type OrderItemStatus = "pending" | "approved" | "delivered" | "cancelled";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
  sellerId: string; // এই আইটেমটা কোন সেলারের প্রোডাক্ট — সেলার-ড্যাশবোর্ড ফিল্টারিং এর জন্য দরকার
  status: OrderItemStatus; // প্রতিটা সেলার শুধু নিজের আইটেমের স্ট্যাটাস বদলাতে পারবে
  note?: string; // সেলারের দেওয়া নোট (যেমন ডেলিভারি নোট) — ক্রেতার ড্যাশবোর্ডে দেখাবে
}

export interface OrderBuyer {
  _id: string;
  name: string;
  email?: string;
  number?: string;
}

export interface Order {
  _id: string;
  userId: string;
  buyer?: OrderBuyer; // GET এ backend populate করে পাঠাবে, বায়ারের নাম/ফোন দেখানোর জন্য
  items: OrderItem[]; // সেলার-ড্যাশবোর্ডের এন্ডপয়েন্ট শুধু ঐ সেলারের আইটেমগুলোই ফিল্টার করে পাঠাবে
  total: number; // পুরো অর্ডারের মোট (সব সেলার মিলিয়ে)
  status: string; // পুরো অর্ডারের overall status (সাধারণত সব আইটেমের status থেকে ডেরাইভড)
  shippingAddress?: string;
  createdAt: string;
}

export interface ApiErrorBody {
  error: string;
  details?: string;
}