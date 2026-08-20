"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "../../../lib/auth-client";

// NOTE: প্রোডাক্ট ডেটা বাইরের ব্যাকএন্ড থেকে আসছে, তাই ProductsPage-এর মতোই
// NEXT_PUBLIC_API_URL env variable ব্যবহার করা হচ্ছে (auth-এর সাথে সম্পর্কিত নয়)।
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://ecommerce-server-woad.vercel.app";

interface Product {
  _id: string;
  name: string;
  nameEn?: string;
  artisan?: string;
  price: number;
  image: string;
  category: string;
  tag?: string;
  stock: number;
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession(); // লগইন করা আছে কিনা চেক করতে
  const user = session?.user;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleAddToCart() {
    // লগইন করা না থাকলে কার্টে যোগ করতে দেওয়া হবে না, লগইন পেজে পাঠানো হবে
    if (!user) {
      router.push("/login");
      return;
    }
    if (!product) return;

    setAdding(true);
    setMessage("");
    try {
      // NOTE: কার্ট এন্ডপয়েন্ট নিজের Next.js অ্যাপের API route (relative path),
      // প্রোডাক্ট ডেটার মতো বাইরের ব্যাকএন্ডে না।
      const res = await fetch(`/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          qty,
        }),
      });
      if (!res.ok) throw new Error();
      setMessage("কার্টে যোগ হয়েছে");
    } catch {
      setMessage("কার্টে যোগ করা যায়নি, আবার চেষ্টা করুন");
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        প্রোডাক্ট পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 md:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full rounded-2xl object-cover"
        />

        <div>
          {product.tag && (
            <span className="mb-3 inline-block rounded-full bg-[#E2A227]/15 px-3 py-1 text-xs font-medium text-[#B1502F] dark:text-[#E2A227]">
              {product.tag}
            </span>
          )}

          <h1 className="font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9]">
            {product.name}
          </h1>

          {product.artisan && (
            <p className="mt-1 text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              {product.artisan}
            </p>
          )}

          <p className="mt-4 text-2xl font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            ৳{product.price}
          </p>

          <p className="mt-2 text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
            {product.stock > 0
              ? `স্টকে আছে (${product.stock} টি)`
              : "স্টকে নেই"}
          </p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-[#202A44]/15 dark:border-[#F6F1E9]/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-4 py-2 text-[#202A44] dark:text-[#F6F1E9]"
              >
                −
              </button>
              <span className="px-3 text-sm text-[#202A44] dark:text-[#F6F1E9]">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-4 py-2 text-[#202A44] dark:text-[#F6F1E9]"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="flex-1 rounded-full bg-[#202A44] py-2.5 text-sm text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
            >
              {adding ? "যোগ হচ্ছে..." : "কার্টে যোগ করুন"}
            </button>
          </div>

          {message && (
            <p className="mt-3 text-sm text-[#B1502F] dark:text-[#E2A227]">
              {message}
            </p>
          )}

          {!user && (
            <p className="mt-3 text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
              কার্টে যোগ করতে হলে আগে লগইন করতে হবে
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
