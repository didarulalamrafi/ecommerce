"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  createdAt: string;
  items: { productId: string; name: string; qty: number }[];
  total: number;
  status: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-server-woad.vercel.app";

// ✅ FIX: backend এখন ইংরেজিতে status পাঠায় (pending/approved/rejected/delivered)
// তাই key গুলো ইংরেজি, আর ডিসপ্লের জন্য বাংলা লেবেল আলাদা রাখা হয়েছে।
const statusConfig: Record<string, { label: string; color: string }> = {
  pending: {
    label: "পেন্ডিং",
    color: "text-[#E2A227]",
  },
  approved: {
    label: "অ্যাপ্রুভড",
    color: "text-[#B1502F] dark:text-[#E2A227]",
  },
  delivered: {
    label: "ডেলিভারড",
    color: "text-green-600 dark:text-green-400",
  },
  rejected: {
    label: "বাতিল",
    color: "text-red-500",
  },
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ FIX: relative "/api/orders/me" এর বদলে বাইরের backend এর সঠিক URL
    fetch(`${API_URL}/api/orders/me`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch((err) => {
        console.error("Failed to fetch orders:", err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10">
      <h2 className="mb-6 text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
        অর্ডার হিস্টরি
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          এখনো কোনো অর্ডার নেই
        </p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const status = statusConfig[order.status] || {
              label: order.status,
              color: "text-[#202A44]/50 dark:text-[#F6F1E9]/50",
            };

            return (
              <div
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#202A44]/10 px-4 py-3 dark:border-[#F6F1E9]/10"
              >
                <div>
                  <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                    #{order._id.slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                    {new Date(order.createdAt).toLocaleDateString("bn-BD")} •{" "}
                    {order.items.length} টি পণ্য
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                    ৳{order.total.toLocaleString("bn-BD")}
                  </p>
                  <p className={`text-xs font-medium ${status.color}`}>
                    {status.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
