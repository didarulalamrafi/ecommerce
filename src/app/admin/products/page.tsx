"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { API_URL, useAuth } from "@/lib/useAuth";

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

const EMPTY_FORM = {
  name: "",
  nameEn: "",
  artisan: "",
  price: "",
  image: "",
  category: "",
  tag: "",
  stock: "",
};

export default function AdminProductsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  // NEW: শুধু admin এই পেজ দেখতে পারবে — user না হলে বা admin না হলে হোমে পাঠিয়ে দেওয়া হচ্ছে
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push("/");
    }
  }, [authLoading, user, isAdmin, router]);

  function loadProducts() {
    fetch(`${API_URL}/api/products`)
      .then((r) => r.json())
      .then(setProducts)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    if (isAdmin) loadProducts();
  }, [isAdmin]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product: Product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      nameEn: product.nameEn || "",
      artisan: product.artisan || "",
      price: String(product.price),
      image: product.image,
      category: product.category,
      tag: product.tag || "",
      stock: String(product.stock),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };

    try {
      const url = editingId
        ? `${API_URL}/api/products/${editingId}`
        : `${API_URL}/api/products`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // admin কুকি পাঠাতে হবে, নাহলে 401/403 আসবে
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      resetForm();
      loadProducts();
    } catch {
      alert("প্রোডাক্ট সেভ করা যায়নি");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("এই প্রোডাক্টটি ডিলিট করতে চান?")) return;

    await fetch(`${API_URL}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    loadProducts();
  }

  if (authLoading || !isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[#202A44]/60 dark:text-[#F6F1E9]/60">
        লোড হচ্ছে...
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-[#202A44]/15 bg-white/60 px-3 py-2 text-sm text-[#202A44] outline-none focus:border-[#E2A227] focus:ring-2 focus:ring-[#E2A227]/30 dark:border-[#F6F1E9]/15 dark:bg-white/5 dark:text-[#F6F1E9]";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-8">
      <h1 className="mb-8 font-[family-name:var(--font-display)] text-3xl text-[#202A44] dark:text-[#F6F1E9]">
        প্রোডাক্ট ম্যানেজমেন্ট
      </h1>

      <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
        {/* Add/Edit form */}
        <form
          onSubmit={handleSubmit}
          className="h-fit space-y-3 rounded-2xl border border-[#202A44]/10 p-6 dark:border-[#F6F1E9]/10"
        >
          <h2 className="mb-2 text-lg font-semibold text-[#202A44] dark:text-[#F6F1E9]">
            {editingId ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট যোগ করুন"}
          </h2>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="নাম (বাংলা)"
            required
            className={inputClass}
          />
          <input
            name="nameEn"
            value={form.nameEn}
            onChange={handleChange}
            placeholder="Name (English)"
            className={inputClass}
          />
          <input
            name="artisan"
            value={form.artisan}
            onChange={handleChange}
            placeholder="কারিগর / বিবরণ"
            className={inputClass}
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="দাম (৳)"
            required
            className={inputClass}
          />
          <input
            name="image"
            value={form.image}
            onChange={handleChange}
            placeholder="ছবির URL"
            required
            className={inputClass}
          />

          {/* TODO: চাইলে এটাকে dropdown বানাতে পারো — Navbar-এর CATEGORIES এর href গুলোর সাথে মিলিয়ে */}
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="ক্যাটাগরি"
            required
            className={inputClass}
          />
          <input
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="ট্যাগ (যেমন: নতুন, ছাড়)"
            className={inputClass}
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="স্টক"
            required
            className={inputClass}
          />

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-full bg-[#202A44] py-2 text-sm text-[#F6F1E9] transition hover:opacity-90 disabled:opacity-50 dark:bg-[#F6F1E9] dark:text-[#202A44]"
            >
              {saving ? "সেভ হচ্ছে..." : editingId ? "আপডেট করুন" : "যোগ করুন"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full border border-[#202A44]/20 px-4 py-2 text-sm text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
              >
                বাতিল
              </button>
            )}
          </div>
        </form>

        {/* Product list */}
        <div className="space-y-3">
          {loading ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              লোড হচ্ছে...
            </p>
          ) : products.length === 0 ? (
            <p className="text-sm text-[#202A44]/60 dark:text-[#F6F1E9]/60">
              কোনো প্রোডাক্ট নেই
            </p>
          ) : (
            products.map((p) => (
              <div
                key={p._id}
                className="flex items-center justify-between gap-4 rounded-xl border border-[#202A44]/10 p-3 dark:border-[#F6F1E9]/10"
              >
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-14 w-14 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-[#202A44] dark:text-[#F6F1E9]">
                      {p.name}
                    </p>
                    <p className="text-xs text-[#202A44]/50 dark:text-[#F6F1E9]/50">
                      {p.category} • ৳{p.price} • স্টক: {p.stock}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => startEdit(p)}
                    className="rounded-full border border-[#202A44]/20 px-3 py-1 text-xs text-[#202A44] dark:border-[#F6F1E9]/20 dark:text-[#F6F1E9]"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="rounded-full border border-[#B1502F]/30 px-3 py-1 text-xs text-[#B1502F] dark:text-[#E2A227]"
                  >
                    ডিলিট
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
