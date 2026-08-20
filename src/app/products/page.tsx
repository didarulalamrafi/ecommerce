"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard, { type Product } from "../../components/ProductCard";

const API_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://ecommerce-server-woad.vercel.app";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("সব");
  const [refreshKey, setRefreshKey] = useState(0);

  // ✅ Refresh button - নতুন product দেখার জন্য
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_URL}/api/products`);
        if (!res.ok) throw new Error("প্রোডাক্ট লোড করা যায়নি");
        const data = await res.json();

        // FIX: backend response array () নাকি { products: [...] } object
        const productList: Product[] = Array.isArray(data)
          ? data
          : data.products || [];

        setProducts(productList);
      } catch (err) {
        setError("প্রোডাক্ট লোড করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        console.error("Error loading products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [refreshKey]);

  // প্রোডাক্ট থেকেই ইউনিক ক্যাটাগরি বের করা
  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category)));
    return ["সব", ...unique];
  }, [products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        activeCategory === "সব" || p.category === activeCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, search]);

  return (
    <div className="min-h-screen bg-[#F6F1E9] px-5 py-12 text-[#202A44] md:px-8 md:py-16">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-8 flex flex-col gap-6 md:mb-10 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl">
                সব প্রোডাক্ট
              </h1>
            </div>
            {/* ✅ Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="rounded-full border border-[#202A44]/30 bg-[#FFFDF8] p-2 hover:bg-[#202A44]/5 disabled:opacity-50 transition-all"
              title="নতুন প্রোডাক্ট রিফ্রেশ করুন"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`${loading ? "animate-spin" : ""}`}
              >
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36M20.49 15a9 9 0 01-14.85 3.36" />
              </svg>
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <SearchIcon />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="প্রোডাক্ট বা ব্র্যান্ড খুঁজুন"
              className="w-full rounded-full border border-[#202A44]/15 bg-[#FFFDF8] py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-[#202A44]/40 focus:border-[#B1502F]"
            />
          </div>
        </div>

        {/* category chips */}
        {!loading && categories.length > 1 && (
          <div className="mb-8 flex flex-wrap gap-2 md:mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  activeCategory === cat
                    ? "border-[#202A44] bg-[#202A44] text-[#F6F1E9]"
                    : "border-[#202A44]/15 bg-transparent text-[#202A44]/70 hover:border-[#202A44]/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* states: loading / error / empty / grid */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* ✅ FIX: Skeleton key - stable key ব্যবহার করছি */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-[#202A44]/10" />
                <div className="mt-3 h-3 w-1/2 rounded bg-[#202A44]/10" />
                <div className="mt-2 h-4 w-3/4 rounded bg-[#202A44]/10" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl border border-[#B1502F]/30 bg-[#B1502F]/5 p-8 text-center">
            <p className="text-sm text-[#B1502F] mb-4">{error}</p>
            <button
              onClick={handleRefresh}
              className="rounded-full border border-[#B1502F] bg-[#B1502F]/10 px-4 py-2 text-sm text-[#B1502F] hover:bg-[#B1502F]/20 transition-colors"
            >
              আবার চেষ্টা করুন
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl border border-[#202A44]/10 bg-[#FFFDF8] p-16 text-center">
            <p className="text-sm text-[#202A44]/60">
              কোনো প্রোডাক্ট পাওয়া যায়নি — অন্য কিছু খুঁজে দেখুন।
            </p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* ✅ FIX: Proper unique key - _id ব্যবহার করছি (best practice) */}
            {filtered.map((product) => (
              <ProductCard
                key={product._id || product.slug}
                product={product}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#202A44]/40"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
