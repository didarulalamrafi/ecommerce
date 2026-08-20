"use client";

import { useEffect, useState } from "react";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export default function CartTab() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  function loadCart() {
    fetch(`/api/cart`, { credentials: "include" })
      .then((r) => r.json())
      .then(setCart)
      .catch(() => setCart([]))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadCart();
  }, []);

  async function updateQty(productId: string, qty: number) {
    if (qty < 1) return;
    await fetch(`/api/cart/${productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ qty }),
    });
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId ? { ...item, qty } : item,
      ),
    );
  }

  async function removeItem(productId: string) {
    await fetch(`/api/cart/${productId}`, {
      method: "DELETE",
      credentials: "include",
    });
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  }

  async function handleCheckout() {
    setPlacing(true);
    try {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setCart([]); // চেকআউট হলে ব্যাকএন্ডে কার্ট খালি হয়ে যায়, এখানেও খালি দেখানো হচ্ছে
      }
    } finally {
      setPlacing(false);
    }
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

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
        কার্ট
      </h2>

      {cart.length === 0 ? (
        <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
          কার্ট খালি
        </p>
      ) : (
        <>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#202A44]/10 px-4 py-3 dark:border-[#F6F1E9]/10"
              >
                <div>
                  <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                    {item.name}
                  </p>
                  <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                    ৳{item.price} × {item.qty}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center rounded-full border border-[#202A44]/15 dark:border-[#F6F1E9]/15">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="px-3 py-1 text-[#202A44] dark:text-[#F6F1E9]"
                    >
                      −
                    </button>
                    <span className="px-2 text-sm text-[#202A44] dark:text-[#F6F1E9]">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="px-3 py-1 text-[#202A44] dark:text-[#F6F1E9]"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-xs text-[#B1502F] hover:underline dark:text-[#E2A227]"
                  >
                    সরান
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#202A44]/10 pt-4 dark:border-[#F6F1E9]/10">
            <span className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
              মোট
            </span>
            <span className="text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
              ৳{total}
            </span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={placing}
            className="mt-4 w-full rounded-full bg-[#202A44] py-2.5 text-sm text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
          >
            {placing ? "অর্ডার হচ্ছে..." : "চেকআউট করুন"}
          </button>
        </>
      )}
    </div>
  );
}
