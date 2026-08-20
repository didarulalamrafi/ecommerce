"use client";

import { useEffect, useState } from "react";

interface Order {
  _id: string;
  createdAt: string;
  items: { productId: string; name: string; qty: number }[];
  total: number;
  status: string;
}

const statusColor: Record<string, string> = {
  পেন্ডিং: "text-[#E2A227]",
  প্রসেসিং: "text-[#B1502F]",
  ডেলিভারড: "text-green-600 dark:text-green-400",
  বাতিল: "text-red-500",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/me`, { credentials: "include" })
      .then((r) => r.json())
      .then(setOrders)
      .catch(() => setOrders([]))
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
          {orders.map((order) => (
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
                  ৳{order.total}
                </p>
                <p
                  className={`text-xs font-medium ${statusColor[order.status] || ""}`}
                >
                  {order.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
