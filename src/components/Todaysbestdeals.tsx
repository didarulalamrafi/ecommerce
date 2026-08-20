"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Product shape coming back from your backend (Express + MongoDB).
 * এখানকার ফিল্ডের নাম তোমার MongoDB ডকুমেন্টের সাথে মিলিয়ে দরকার হলে পাল্টে নিও —
 * যেমন যদি ব্যাকএন্ডে `title` হয় `name` এর বদলে, তাহলে এখানেও `title` করে দাও।
 */
interface Product {
  _id: string;
  name: string;
  seller: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  img: string;
}

/**
 * 👉 তোমার ব্যাকএন্ডের API URL এখানে বসাও।
 * .env.local ফাইলে এভাবে রাখলে ভালো (production এ পাল্টানো সহজ হবে):
 *   NEXT_PUBLIC_APP_URL=https://your-backend.onrender.com
 * তারপর নিচের লাইনটা এমনিতেই কাজ করবে।
 */
const API_BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-server-woad.vercel.app";

// আসল এন্ডপয়েন্ট — তোমার Express রাউট অনুযায়ী পাল্টে নিও, যেমন "/api/products/featured"
const TODAYS_DEALS_ENDPOINT = `${API_BASE_URL}/api/products?featured=true&limit=8`;

export default function TodaysBestDeals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // component mount হওয়ার সাথে সাথে ব্যাকএন্ড থেকে প্রোডাক্ট ফেচ করবে
    async function fetchProducts() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(TODAYS_DEALS_ENDPOINT, {
          cache: "no-store", // সবসময় লেটেস্ট ডেটা আনবে, পুরনো ক্যাশড ডেটা না
        });

        if (!res.ok) {
          throw new Error(
            `API থেকে ডেটা আনতে সমস্যা হয়েছে (status: ${res.status})`,
          );
        }

        const data = await res.json();

        // ধরে নিচ্ছি API সরাসরি প্রোডাক্টের array রিটার্ন করে।
        // যদি তোমার API `{ products: [...] }` এভাবে wrap করে পাঠায়, তাহলে data.products লিখো।
        setProducts(Array.isArray(data) ? data : data.products || []);
      } catch (err) {
        console.error("Failed to fetch today's deals:", err);
        setError("প্রোডাক্ট লোড করতে সমস্যা হয়েছে, একটু পরে আবার চেষ্টা করো।");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

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

        {/* ========== লোডিং অবস্থা: skeleton card দেখাবে ========== */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-[#F5F6F8] p-3"
              >
                <div className="mb-3 h-36 rounded-xl bg-[#14213D]/10 md:h-44" />
                <div className="mb-2 h-4 w-3/4 rounded bg-[#14213D]/10" />
                <div className="h-4 w-1/2 rounded bg-[#14213D]/10" />
              </div>
            ))}
          </div>
        )}

        {/* ========== এরর অবস্থা ========== */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ========== ডেটা এসে গেলে খালি চেক ========== */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-[#14213D]/10 bg-[#F5F6F8] p-6 text-center text-sm text-[#14213D]/50">
            এখন কোনো ডিল নেই।
          </div>
        )}

        {/* ========== আসল প্রোডাক্ট গ্রিড ========== */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => {
              const discount = Math.round(
                ((p.originalPrice - p.price) / p.originalPrice) * 100,
              );
              return (
                <Link
                  key={p._id}
                  href={`/products/${p._id}`}
                  className="group rounded-2xl border border-[#14213D]/10 bg-[#F5F6F8] p-3 transition-shadow hover:shadow-lg"
                >
                  <div className="relative mb-3 h-36 overflow-hidden rounded-xl md:h-44">
                    <Image
                      src={p.img}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-2 top-2 rounded-full bg-[#FF5A1F] px-2 py-0.5 text-[11px] font-medium text-white">
                      -{discount}%
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm font-medium leading-snug">
                    {p.name}
                  </p>
                  <p className="mt-1 text-xs text-[#14213D]/45">{p.seller}</p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-[#14213D]/60">
                    <StarIcon />
                    {p.rating}{" "}
                    <span className="text-[#14213D]/35">({p.reviews})</span>
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-mono)] text-sm font-semibold">
                        ৳{p.price}
                      </span>
                      <span className="font-[family-name:var(--font-mono)] text-xs text-[#14213D]/35 line-through">
                        ৳{p.originalPrice}
                      </span>
                    </div>
                    <button
                      aria-label="কার্টে যোগ করুন"
                      onClick={(e) => e.preventDefault()} // কার্ড ক্লিকের সাথে conflict এড়ানোর জন্য
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#14213D] text-white transition-colors hover:bg-[#FF5A1F]"
                    >
                      <PlusIcon />
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
