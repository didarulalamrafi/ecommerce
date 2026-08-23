"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../context/CartContext";

/**
 * Dashboard এর "কার্ট" ট্যাবে ব্যবহার হবে।
 * CartContext এর addToCart যেভাবে backend এ কল করে, এখানেও একই
 * API_URL এবং credentials: "include" প্যাটার্ন মিলিয়ে রাখা হয়েছে।
 */

interface CartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

const API_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-server-woad.vercel.app";

export default function CartTab() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  // ✅ Navbar এর badge count sync রাখার জন্য
  const { refreshCart } = useCart();

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function fetchCart() {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/cart`, { credentials: "include", cache: "no-store" })
      .then((r) => {
        if (!r.ok) throw new Error(`Status ${r.status}`);
        return r.json();
      })
      .then((data: CartItem[]) => {
        setItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to fetch cart:", err);
        setError("কার্ট লোড করতে সমস্যা হয়েছে");
      })
      .finally(() => setLoading(false));
  }

  async function updateQty(productId: string, newQty: number) {
    if (newQty < 1) return;
    setUpdatingId(productId);
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ qty: newQty }),
      });
      if (!res.ok) throw new Error();

      setItems((prev) =>
        prev.map((i) =>
          i.productId === productId ? { ...i, qty: newQty } : i,
        ),
      );
      refreshCart(); // Navbar badge আপডেট
    } catch {
      setError("কোয়ান্টিটি আপডেট করা যায়নি");
    } finally {
      setUpdatingId(null);
    }
  }

  async function removeItem(productId: string) {
    setUpdatingId(productId);
    try {
      const res = await fetch(`${API_URL}/api/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error();

      setItems((prev) => prev.filter((i) => i.productId !== productId));
      refreshCart();
    } catch {
      setError("প্রোডাক্ট রিমুভ করা যায়নি");
    } finally {
      setUpdatingId(null);
    }
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex animate-pulse gap-4 rounded-xl bg-[#202A44]/5 p-4 dark:bg-white/5"
          >
            <div className="h-16 w-16 shrink-0 rounded-lg bg-[#202A44]/10 dark:bg-white/10" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/2 rounded bg-[#202A44]/10 dark:bg-white/10" />
              <div className="h-3 w-1/4 rounded bg-[#202A44]/10 dark:bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error && items.length === 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
        {error}
        <button
          onClick={fetchCart}
          className="ml-2 underline hover:no-underline"
        >
          আবার চেষ্টা করুন
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-[#202A44]/10 bg-[#202A44]/5 p-10 text-center dark:border-[#F6F1E9]/10 dark:bg-white/5">
        <p className="mb-4 text-sm text-[#202A44]/50 dark:text-[#F6F1E9]/50">
          কার্ট খালি
        </p>
        <Link
          href="/products"
          className="inline-block rounded-full bg-[#202A44] px-6 py-2 text-sm text-[#F6F1E9] transition hover:opacity-90 dark:bg-[#F6F1E9] dark:text-[#202A44]"
        >
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-3">
        {items.map((item) => (
          // ✅ মোবাইল ফিক্স: আগে সব (ছবি + নাম/দাম + qty + remove) একলাইনে
          // পাশাপাশি ছিল, ফলে মোবাইলে জায়গায় না ধরে ট্র্যাশ আইকনটা কেটে
          // যাচ্ছিল। এখন ছোট স্ক্রিনে দুই সারিতে ভাগ হবে (flex-col), আর
          // sm ব্রেকপয়েন্ট থেকে (ট্যাবলেট/ডেস্কটপ) আগের মতোই একলাইনে
          // (sm:flex-row) দেখাবে।
          <div
            key={item.productId}
            className="flex flex-col gap-3 rounded-xl border border-[#202A44]/10 p-2.5 sm:flex-row sm:items-center sm:gap-4 sm:p-3 dark:border-[#F6F1E9]/10"
          >
            {/* --- উপরের সারি (মোবাইল): ছবি + নাম/দাম, একসাথে পাশাপাশি --- */}
            <div className="flex items-center gap-3 sm:flex-1 sm:gap-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-[#202A44]/5 dark:bg-white/5">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-[#202A44]/30">
                    ছবি নেই
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                  {item.name}
                </p>
                <p className="mt-1 font-[family-name:var(--font-mono)] text-sm text-[#202A44]/70 dark:text-[#F6F1E9]/70">
                  ৳{item.price.toLocaleString("bn-BD")}
                </p>
              </div>
            </div>

            {/* --- নিচের সারি (মোবাইল): qty stepper + remove, দুই পাশে ছড়িয়ে;
                sm থেকে ডানপাশে গুটিয়ে আগের সারির সাথেই বসে যাবে --- */}
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="flex items-center rounded-full border border-[#202A44]/15 dark:border-[#F6F1E9]/15">
                <button
                  onClick={() => updateQty(item.productId, item.qty - 1)}
                  disabled={updatingId === item.productId || item.qty <= 1}
                  className="px-3 py-1.5 text-[#202A44] disabled:opacity-30 dark:text-[#F6F1E9]"
                >
                  −
                </button>
                <span className="w-6 text-center text-sm text-[#202A44] dark:text-[#F6F1E9]">
                  {item.qty}
                </span>
                <button
                  onClick={() => updateQty(item.productId, item.qty + 1)}
                  disabled={updatingId === item.productId}
                  className="px-3 py-1.5 text-[#202A44] disabled:opacity-30 dark:text-[#F6F1E9]"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeItem(item.productId)}
                disabled={updatingId === item.productId}
                aria-label="রিমুভ করুন"
                className="shrink-0 rounded-full p-2 text-[#B1502F] transition hover:bg-[#B1502F]/10 disabled:opacity-30 dark:text-[#E2A227]"
              >
                <TrashIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#202A44]/10 pt-4 dark:border-[#F6F1E9]/10">
        <span className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
          মোট
        </span>
        <span className="font-[family-name:var(--font-mono)] text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
          ৳{total.toLocaleString("bn-BD")}
        </span>
      </div>

      <Link href={"../checkout"}>
        <button className="mt-4 w-full rounded-full bg-[#202A44] py-3 text-sm font-medium text-[#F6F1E9] transition hover:opacity-90 dark:bg-[#F6F1E9] dark:text-[#202A44]">
          চেকআউট করুন
        </button>
      </Link>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0-1 14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L4 6h16Z" />
    </svg>
  );
}
