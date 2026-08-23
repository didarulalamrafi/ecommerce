"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

/**
 * ✅ আপডেটেড Product interface - backend actual field names অনুযায়ী
 */
interface Product {
  _id: string;
  name: string;
  slug: string;
  brand?: string;
  sellerName?: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  image: string;
  category?: string;
  stock?: number;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-server-woad.vercel.app";

const TODAYS_DEALS_ENDPOINT = `${API_BASE_URL}/api/products?limit=8`;

export default function TodaysBestDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // ✅ FIX: CartContext থেকে addToCart নেওয়া হচ্ছে
  const { addToCart } = useCart();
  // ✅ কোন প্রোডাক্ট এখন "যোগ হচ্ছে" অবস্থায় আছে সেটা track করা (বাটন ডিসেবল করার জন্য)
  const [addingId, setAddingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(TODAYS_DEALS_ENDPOINT, {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data = await res.json();

        const productList: Product[] = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
      } catch (err) {
        console.error("Failed to fetch today's deals:", err);
        setError("প্রোডাক্ট লোড করতে সমস্যা হয়েছে, একটু পরে আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ✅ FIX: + বাটনে ক্লিক করলে এখন সত্যিই কার্টে যোগ হবে
  async function handleAddToCart(e: React.MouseEvent, p: Product) {
    e.preventDefault(); // Link এর navigation আটকানো
    e.stopPropagation();

    setAddingId(p._id);
    const success = await addToCart({
      productId: p._id,
      name: p.name,
      price: p.price,
      image: p.image,
      qty: 1,
    });
    setAddingId(null);

    if (!success) {
      // লগইন করা না থাকলে বা এরর হলে লগইন পেজে পাঠানো
      window.location.href = "/login";
    }
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold md:text-4xl">
            আজকের সেরা ডিল
          </h2>
          <Link
            href="/products"
            className="hidden text-sm text-[#FF5A1F] hover:underline md:block"
          >
            সব প্রোডাক্ট →
          </Link>
        </div>

        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="animate-pulse rounded-2xl bg-[#F5F6F8] p-3"
              >
                <div className="mb-3 h-36 rounded-xl bg-[#14213D]/10 md:h-44" />
                <div className="mb-2 h-4 w-3/4 rounded bg-[#14213D]/10" />
                <div className="h-4 w-1/2 rounded bg-[#14213D]/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-[#14213D]/10 bg-[#F5F6F8] p-6 text-center text-sm text-[#14213D]/50">
            এখন কোনো ডিল নেই।
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const imageUrl =
                p.image && p.image.trim() !== ""
                  ? p.image
                  : "/images/placeholder.png";

              const discount =
                p.discount ??
                (p.oldPrice && p.oldPrice > 0
                  ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
                  : 0);

              return (
                <Link
                  key={p._id}
                  href={`/products/${p.slug || p._id}`}
                  className="group rounded-2xl border border-[#14213D]/10 bg-[#F5F6F8] p-3 transition-shadow hover:shadow-lg"
                >
                  <div className="relative mb-3 h-36 overflow-hidden rounded-xl md:h-44">
                    <Image
                      src={imageUrl}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.src = "/images/placeholder.png";
                      }}
                    />
                    {discount > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#FF5A1F] px-2 py-0.5 text-[11px] font-medium text-white">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <p className="line-clamp-2 text-sm font-medium leading-snug">
                    {p.name}
                  </p>

                  <p className="mt-1 text-xs text-[#14213D]/45">
                    {p.sellerName || p.brand || "অজানা"}
                  </p>

                  {p.rating != null && p.rating > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-[#14213D]/60">
                      <StarIcon />
                      {p.rating.toFixed(1)}{" "}
                      <span className="text-[#14213D]/35">
                        ({p.reviewCount || 0})
                      </span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-mono)] text-sm font-semibold">
                        ৳{p.price.toLocaleString("bn-BD")}
                      </span>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <span className="font-[family-name:var(--font-mono)] text-xs text-[#14213D]/35 line-through">
                          ৳{p.oldPrice.toLocaleString("bn-BD")}
                        </span>
                      )}
                    </div>
                    <button
                      aria-label="কার্টে যোগ করুন"
                      onClick={(e) => handleAddToCart(e, p)}
                      disabled={addingId === p._id}
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#14213D] text-white transition-colors hover:bg-[#FF5A1F] disabled:opacity-50"
                    >
                      {addingId === p._id ? <SpinnerIcon /> : <PlusIcon />}
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function StarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="#FFC93C"
      stroke="#FFC93C"
      strokeWidth="1"
    >
      <path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
