"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getMySellerOrders } from "@/services/orders";
import { ApiError } from "@/lib/api";
import type { Order } from "@/types";
import { OrderCard, OrderDetailsModal } from "../components/OrderComponents";
// import { OrderCard, OrderDetailsModal } from "../OrderComponents";
// import {
//   OrderCard,
//   OrderDetailsModal,
// } from "@/seller/OrderComponents";

export default function SellerOrdersPage() {
  const { data: session, isPending: authLoading } = useSession();
  const router = useRouter();

  const role = session?.user?.role;
  const canAccess = role === "seller" || role === "admin";

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!authLoading && (!session?.user || !canAccess)) {
      router.push("/");
    }
  }, [authLoading, session, canAccess, router]);

  async function loadOrders() {
    try {
      const res = await getMySellerOrders();
      setOrders(res);
      setSelectedOrder((prev) =>
        prev ? res.find((o) => o._id === prev._id) || null : null,
      );
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "অর্ডার লোড করা যায়নি");
    } finally {
      setLoadingOrders(false);
    }
  }

  useEffect(() => {
    if (canAccess) loadOrders();
  }, [canAccess]);

  if (authLoading || !canAccess) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  const pendingCount = orders.filter((o) =>
    o.items.some((i) => i.status === "pending"),
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 md:px-8 lg:px-10 lg:py-14">
      <div className="mb-8 flex items-center gap-3">
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9] lg:text-4xl">
          আমার অর্ডার
        </h1>
        {pendingCount > 0 && (
          <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-[#E2A227] px-1.5 text-xs font-bold text-white">
            {pendingCount}
          </span>
        )}
      </div>

      {loadingOrders ? (
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          লোড হচ্ছে...
        </p>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[240px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#202A44]/15 text-center dark:border-[#F6F1E9]/15">
          <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            এখনো কোনো অর্ডার আসেনি
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((o) => (
            <OrderCard key={o._id} order={o} onOpen={setSelectedOrder} />
          ))}
        </div>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onChanged={loadOrders}
        />
      )}
    </div>
  );
}
