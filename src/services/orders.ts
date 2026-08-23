// services/orders.ts
import { api } from "@/lib/api";
import type { Order } from "@/types";

// ---- ক্রেতার নিজের সব অর্ডার (buyer dashboard) ----
// ব্যাকএন্ড (myOrders) প্লেইন অ্যারে রিটার্ন করে: res.json(orders)
export function getMyOrders() {
  return api.get<Order[]>("/api/orders/me");
}

// ---- সেলারের ড্যাশবোর্ড — শুধু সেই সেলারের প্রোডাক্ট থাকা অর্ডারগুলো,
// এবং প্রতিটা order.items ব্যাকএন্ডে ফিল্টার হয়ে শুধু এই সেলারের আইটেমই থাকবে ----
// ব্যাকএন্ড (mySellerOrders) এটাও প্লেইন অ্যারে রিটার্ন করে
export function getMySellerOrders() {
  return api.get<Order[]>("/api/orders/seller/me");
}

// প্রতিটা অ্যাকশন item-লেভেলে — কারণ একই অর্ডারে অন্য সেলারের আইটেমও থাকতে পারে,
// তাই একজন সেলার শুধু নিজের productId-এর আইটেমটাই বদলাতে পারবে (ব্যাকএন্ডে ownership চেক হবে)

export function approveOrderItem(orderId: string, productId: string) {
  return api.patch<{ message: string }>(
    `/api/orders/${orderId}/items/${productId}/approve`,
    {},
  );
}

// নোটসহ ডেলিভারড মার্ক — এই নোট ক্রেতার ড্যাশবোর্ডে ঐ আইটেমের সাথে দেখাবে
export function deliverOrderItem(
  orderId: string,
  productId: string,
  note: string,
) {
  return api.patch<{ message: string }>(
    `/api/orders/${orderId}/items/${productId}/deliver`,
    { note },
  );
}

// "ডিলিট" আসলে item-টাকে cancelled মার্ক করে — পুরো অর্ডার ডিলিট করা হয় না,
// কারণ অন্য সেলারের আইটেম একই অর্ডারে থাকতে পারে
export function cancelOrderItem(orderId: string, productId: string) {
  return api.patch<{ message: string }>(
    `/api/orders/${orderId}/items/${productId}/cancel`,
    {},
  );
}